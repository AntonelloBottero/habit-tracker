import { DateTime } from "luxon"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { HabitWithSlots, ModalRef } from "@/app/types"
import { useMemo, useRef } from "react"
import { CalendarToday } from "@project-lary/react-material-symbols-700-rounded"
import Modal from "./Modal"
import useHabits from "@/hooks/useHabits"

interface Props {
  habit: HabitWithSlots
  className?: string
}

export default function SlotsCard({ habit, className = '' }: Props) {
  const slots = useMemo(() => {
    return habit?.slots ?? []
  }, [habit])

  const count = useMemo(() => {
    return slots.reduce((r, slot) => r += Number(slot.count), 0)
  }, [slots])
  const completion = useMemo(() => {
    return slots.reduce((r, slot) => r += slot.completion, 0)
  }, [habit])

  const modalRef = useRef<ModalRef>(null)
  const { calculateMonthlySlots } = useHabits()
  function handleCardClick() {
    modalRef.current?.show()
    calculateMonthlySlots(habit, DateTime.now().toISO())
  }

  return habit ? (
    <>
      <div className={`${className} ht-interaction pt-2 pb-3 px-4 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-200 flex flex-col gap-2`} onClick={handleCardClick}>
        <HabitsCardHeader habit={habit} />
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm mr-1">
            <CalendarToday />
            <span>
              {habit.granularity}
              {habit.granularity_times > 1 && ` (${habit.granularity_times} times)`}
            </span>
          </div>
          {slots.length === 1 && (
            <div className="flex items-center gap-1 ml-auto">
              <SlotsCompletionChip completion={completion} count={count} />
            </div>
          )}
        </div>
        {slots.length > 1 && (
          <>
            <div className="w-full border-t-1 border-green-200" />
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-1 text-sm mr-1">
                {slots.length} slots
              </div>
              <div className="flex items-center gap-1 ml-auto">
              <SlotsCompletionChip completion={completion} count={count} />
              </div>
            </div>
          </>
        )}
      </div>

      <Modal ref={modalRef} title="Overall progress" size="max-w-xl" role="compressed-slots-modal">
        <div className="flex flex-col gap-2">
          <HabitsCardHeader habit={habit} />
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-1 text-sm mr-1">
              <CalendarToday />
              <span>
                {habit.granularity}
                {habit.granularity_times > 1 && ` (${habit.granularity_times} times)`}
              </span>
            </div>
          </div>
          <div className="w-full border-t-1 border-stone-200" />
          <div className="flex flex-wrap items-center gap-4">
            <div className="grow w-full font-bold">
              Progress details
            </div>
            {slots.map(slot => (
              <div key={slot.id} className="text-sm">
                {slot.active_to.substring(0, 10)}<br />
                {slot.completion}/{slot.count}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  ) : null
}