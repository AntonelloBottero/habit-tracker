import { DateTime } from "luxon"
import { habitsModel, HabitsSchema, slotsModel, SlotsSchema } from "@/db/DbClass"
import useDbCrud from '@/db/useDbCrud'

export default function useHabits() {
  const habitsCrud = useDbCrud({ table: 'habits', model: habitsModel })
  const slotsCrud = useDbCrud({ table: 'slots', model: slotsModel })

  // --- Calculate monthly slots based on habit and date ---
  function calculateMonthlySlots(habit: HabitsSchema & { id: number }, date: string): SlotsSchema[] {
    if(!habit || !date) { return []}

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

    const activeTo = habit.granularity !== 'yearly' ? to : DateTime.fromISO(date).endOf('year')
    const slots = []
    do {
      slots.push({
        habit_id: habit.id,
        event_ids: [],
        count: granularityTimes,
        completion: 0,
        active_to: activeTo.toISO()
      })
      activeTo.minus({ days: daysCount })
    } while(activeTo.toFormat('yyyy-MM-dd') >= from.toFormat('yyyy-MM-dd'))
    return slots
  }

  // --- Fetch habits to calculate slots ---
  async function fetchManageableHabits(manage_from: string): Promise<HabitsSchema[]> {
    if(!manage_from) { return [] }
    return await habitsCrud.index(item => item.manage_from <= manage_from) as HabitsSchema[]
  }

  // fetch slots to be presented to user
  async function fetchActiveSlots(from: string): Promise<SlotsSchema[]> {
    if(!from) { return [] }
    return await slotsCrud.index(item => {
      return item.active_to >= from // regardless of the time range (month, week, day), every slots still active will be included
    }) as SlotsSchema[]
  }

  return { calculateMonthlySlots, fetchManageableHabits, fetchActiveSlots }
}