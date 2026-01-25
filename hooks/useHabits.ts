import { DateTime } from "luxon"
import { eventsModel, EventsSchema, habitsModel, HabitsSchema, slotsModel, SlotsSchema, DbResourceSchema } from "@/db/DbClass"
import useDbCrud from '@/db/useDbCrud'
import { SelectableHabit } from "@/app/types"

export default function useHabits() {
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })
  const slotsCrud = useDbCrud({ table: 'slots', model: slotsModel })
  const eventsCrud = useDbCrud({ table: 'events', model: eventsModel })

  // --- Calculate monthly slots based on habit and date ---
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

  // --- Create Monthly slots (fetchManageableHabits * calculateMonthlySlots) ---
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

  // fetch slots to be presented to user
  async function fetchActiveSlots(from: string): Promise<DbResourceSchema<SlotsSchema>[]> {
    if(!from) { return [] }
    return await slotsCrud.index(item => {
      return item.active_to >= from // regardless of the time range (month, week, day), every slots still active will be included
    })
  }

  // fetch habits linkable to an event -> habits that have an active slot based on the datetime desired
  async function fetchSelectableHabits(datetime: string): Promise<SelectableHabit[]> {
    const habits = await habitsCrud.index()
    const slots = await slotsCrud.index(item => item.active_to >= datetime && item.completion < item.count, { field: 'active_to', reverse: true }) // fetches slots not yet completed, sorted by active_to
    return habits.map(habit => {
      const slot = slots.find(slot => slot.habit_id === habit.id) // since slots are sorted by active_to, the first one in the array is the most appropriate to be selected, given the datetime of the event
      return slot ? { ...habit, slot } : null
    }).filter(Boolean) as SelectableHabit[]
  }

  async function fetchEvents(from: string, to: string): Promise<EventsSchema[]> {
    if(!from || !to) { return [] }
    return await eventsCrud.index(item => {
      return item.datetime >= from && item.datetime <= to
    }) as EventsSchema[]
  }

  return {
    calculateMonthlySlots,
    fetchManageableHabits,
    createMonthlySlots,
    fetchActiveSlots,
    fetchEvents,
    fetchSelectableHabits
  }
}