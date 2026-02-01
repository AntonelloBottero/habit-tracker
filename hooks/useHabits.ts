import { DateTime } from "luxon"
import { eventsModel, EventsSchema, habitsModel, HabitsSchema, slotsModel, SlotsSchema, DbResourceSchema } from "@/db/DbClass"
import useDbCrud from '@/db/useDbCrud'
import { SelectableHabit } from "@/app/types"
import useDb from "@/db/useDb"

export default function useHabits() {
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })
  const slotsCrud = useDbCrud({ table: 'slots', model: slotsModel })
  const eventsCrud = useDbCrud({ table: 'events', model: eventsModel })

  // --- Utils ---
  function calculateSlotMaxDate(granularity: string, datetime: string): string | null {
    const date = DateTime.fromISO(datetime)
    if(!granularity || !date) { return null }

    switch(granularity) {
    case 'yearly':
      return date.endOf('year').toISO()
    case 'monthly':
      return date.endOf('month').toISO()
    case 'weekly':
      return date.endOf('week').toISO()
    default:
      return date.endOf('day').toISO()
    }
  }

  function slotIsInRange(slot: DbResourceSchema<SlotsSchema>, habit: DbResourceSchema<HabitsSchema>, datetime: string) {
    const slotMaxDate = calculateSlotMaxDate(habit?.granularity, datetime)
    if(!slot?.active_to || !slotMaxDate) { return false }
    return slot.active_to >= datetime && slot.active_to <= slotMaxDate
  }

  // --- calculateMonthlySlots ---
  // Calculate monthly slots based on habit and date
  function calculateMonthlySlots(habit: DbResourceSchema<HabitsSchema> & { id: number }, date: string): SlotsSchema[] {
    if(!habit || !date) { return [] }

    const from = DateTime.fromISO(date).startOf('month')
    const to = DateTime.fromISO(date).endOf('month')
    const granularityDaysCount = {
      daily: 1,
      weekly: 7,
      monthly: to.diff(from, ['days']).days,
      yearly: 366
    } as Record<string, number>
    const daysCount = granularityDaysCount[habit.granularity] || 1
    const granularityTimes = habit.granularity === 'daily' ? 1 : (habit.granularity_times || 1)

    let activeTo = habit.granularity !== 'yearly' ? to : DateTime.fromISO(date).endOf('year')
    const slots = []
    do {
      slots.push({
        habit_id: habit.id,
        event_ids: [],
        count: granularityTimes,
        completion: 0,
        active_to: activeTo.toISO()
      })
      activeTo = activeTo.minus({ days: daysCount })
      if(habit.granularity === 'weekly') {
        activeTo = activeTo.endOf('week')
      }
    } while(activeTo.minus({ days: daysCount }).toFormat('yyyy-MM-dd') >= from.toFormat('yyyy-MM-dd')) // temporarily removing a day/week/month/year simulates an active_from field (we won't add a new slot if the active period spans across two months)
    return slots as SlotsSchema[]
  }

  // --- Fetch habits to calculate slots ---
  async function fetchManageableHabits(manage_from: string): Promise<DbResourceSchema<HabitsSchema>[]> {
    if(!manage_from) { return [] }
    return await habitsCrud.index(item => item.manage_from <= manage_from) as DbResourceSchema<HabitsSchema>[]
  }

  // --- createMonthlySlots ---
  // Create Monthly slots (fetchManageableHabits * calculateMonthlySlots)
  async function createMonthlySlots(datetime: string): Promise<void> {
    const manage_from = DateTime.fromISO(datetime).startOf('month')
    if(!manage_from) { return undefined }
    const updated_managed_from = manage_from.endOf('month')
    const habits = await fetchManageableHabits(manage_from.toISO() as string)
    const slots = habits
      .map((habit) => calculateMonthlySlots(habit, datetime))
      .flat()
    await slotsCrud.bulkStore(slots)
    const updatedHabits = habits.map((habit) => ({
      ...habit,
      manage_from: updated_managed_from.toISO()
    })) as unknown as DbResourceSchema<HabitsSchema>[]
    await habitsCrud.bulkUpdate(updatedHabits)
  }

  // --- fetchActiveSlots ---
  // fetch slots to be presented to user
  async function fetchActiveSlots(from: string, to: string): Promise<DbResourceSchema<SlotsSchema>[]> {
    if(!from || !to) { return [] }
    return await slotsCrud.index(item => {
      return item.active_to >= from && item.active_to <= to // regardless of the time range (month, week, day), every slots still active will be included
    })
  }

  // --- fetchSelectableHabits ---
  // fetch habits linkable to an event -> habits that have an active slot based on the datetime desired
  async function fetchSelectableHabits(datetime: string, now: string | null = null): Promise<SelectableHabit[]> {
    const internalNow = now ? DateTime.fromISO(now) : DateTime.now() // we allow caller to give a today string for testing purposes
    if(internalNow.toFormat('dd/MM/yyyy') !== DateTime.fromISO(datetime).toFormat('dd/MM/yyyy')) { return [] } // we can't allow to select habits in different days than today

    const habits = await habitsCrud.index()
    const selectableHabits = await Promise.all(
      habits.map(async habit => {
        const slots = await slotsCrud.index(item => {
          return item.habit_id === habit.id
            && slotIsInRange(item, habit, internalNow.toISO())
            && slotIsInRange(item, habit, datetime)
            && item.completion < item.count
        }, { field: 'active_to', reverse: false }) // fetches slots not expired and not yet completed, sorted by active_to
        const slot = slots[0]
        return slot ? { ...habit, slot } : null
      })
    )
    return selectableHabits.filter(Boolean) as SelectableHabit[]
  }

  // --- fetchEvents ---
  async function fetchEvents(from: string, to: string): Promise<EventsSchema[]> {
    if(!from || !to) { return [] }
    return await eventsCrud.index(item => {
      return item.datetime >= from && item.datetime <= to
    }) as EventsSchema[]
  }

  // --- saveEvent ---
  async function saveEvent(model: EventsSchema, slot_id: number, now?: string): Promise<void> {
    const internalNow = now || DateTime.now().toISO()
    const slots = await slotsCrud.index(item => item.id === slot_id && item.active_to >= internalNow && item.completion < item.count) // we have to check if slot is still available
    if(!slots.length) {
      throw new ReferenceError('The slot linked to the habit you chose is expired')
    }

    const newEvent = await eventsCrud.store(model)

    const slot = slots[0]
    const updatedSlot = {
      ...slot,
      event_ids: [...slot.event_ids, (newEvent as DbResourceSchema<EventsSchema>).id],
      completion: slot.completion + 1
    }
    await slotsCrud.update(slot.id, updatedSlot)
  }

  // --- Setup ---
  const { getOption, createOption } = useDb()
  async function setup(force = false): Promise<boolean> {
    const lastSetupAt = await getOption('last_setup_at')
    if(!lastSetupAt && !force) { return false } // we cannot perform a setup if user didn't provide his habits
    if((lastSetupAt || '') >= DateTime.now()) { return true } // last setup is still in active

    await createMonthlySlots(DateTime.now().toISO())
    await createOption('last_setup_at', DateTime.now().endOf('month').toISO()) // the setup will last for the whole month
    return true
  }

  return {
    calculateMonthlySlots,
    fetchManageableHabits,
    createMonthlySlots,
    fetchActiveSlots,
    fetchEvents,
    fetchSelectableHabits,
    saveEvent,
    setup
  }
}