import CompressedSlotsCard from '@/components/CompressedSlotsCard'
import SlotsCard from '@/components/SlotsCard'
import { HabitRawProps } from '@/src/habits/mappers/HabitMapper'
import { SlotRawProps } from '@/src/slots/mappers/SlotMapper'

interface Props {
  habits: (HabitRawProps & { slots: SlotRawProps[] })[]
}

export default function ScheduleList({ habits }: Props) {
  const goodHabits = habits.filter(habit => habit.type === 'good')
  const badHabits = habits.filter(habit => habit.type === 'bad')

  return (
    <div className="flex flex-col gap-4">
      {goodHabits.length && (
        <>
          <div className="text-sm">
            Good habits
          </div>
          {goodHabits.map(habit => (
            <div key={habit.id}>
              {habit.slots.length === 1 ? <SlotsCard habit={habit} slot={habit.slots[0]} /> : <CompressedSlotsCard habit={habit} key={habit.id} />}
            </div>
          ))}
        </>
      )}

      {badHabits.length && (
        <>
          <div className="text-sm">
            Bad habits
          </div>
          {badHabits.map(habit => (
            <div key={habit.id}>
              {habit.slots.length === 1 ? <SlotsCard habit={habit} slot={habit.slots[0]} /> : <CompressedSlotsCard habit={habit} key={habit.id} />}
            </div>
          ))}
        </>
      )}
    </div>
  )
}