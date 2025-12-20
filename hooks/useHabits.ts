import { useMemo } from "react"
import { DateTime } from "luxon"
import { HabitsSchema } from "@/db/DbClass"

export default function useHabits(date: string) {
  // TODO: from and to should be passed as parameters
  const from = useMemo(() => { // start of month
    return DateTime.fromISO(date).startOf('month')
  }, [date])
  const to = useMemo(() => { // end of month
    return DateTime.fromISO(date).endOf('month')
  }, [date])

  const daysCount = useMemo(() => {
    if(!from || !to) { return 0 }
    const { days } = to.diff(from, ['days'])
    return days
  }, [from, to])

  const granularityDaysCount = useMemo<Record<string,  number>>(() => {
    return {
      daily: 1,
      weekly: 7,
      monthly: daysCount + 1,
      yearly: 367
    }
  }, [daysCount])

  function calculateSlots(habit: HabitsSchema & { id: number }) {
    if(!habit) { return []}

    const dasyCount = granularityDaysCount[habit.granularity] || 1
    const granularityTimes = (habit.granularity === 'daily' ? 1 : habit.granularity_times) || 1
    // TODO: from and activeTo should be global, with from starting at the begin of the month
    const activeTo = habit.granularity !== 'yearly' ? to : DateTime.fromISO(date).endOf('year')
    const slots = []
    do {
      slots.push({
        habit_id: habit.id,
        event_ids: []
      })
      activeTo.minus({ days: daysCount })
    } while(activeTo.toFormat('yyyy-MM-dd') >= from.toFormat('yyyy-MM-dd'))
    /* return Array.from(Array(granularityCount).keys()).map(() => ({
      habit_id: habit.id,
      event_ids: [],
      count: granularityTimes
    })) */
  }

  return { calculateSlots }
}