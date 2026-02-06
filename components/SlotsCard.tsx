import { useRef } from "react"
import { CalendarToday } from "@project-lary/react-material-symbols-700-rounded"
import { DbResourceSchema, HabitsSchema, SlotsSchema } from "@/db/DbClass"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import SlotDetailsModal from "@/components/SlotDetailsModal"
import { ModalRef } from "@/app/types"

interface Props {
  slot: DbResourceSchema<SlotsSchema>
  habit: DbResourceSchema<HabitsSchema>
  className?: string
}

export default function SlotsCard({ slot, habit, className = '' }: Props) {
  const modalRef = useRef<ModalRef>(null)
  function showModal() {
    modalRef.current?.show()
  }

  return habit ? (
    <>
      <div className={`${className} ht-interaction pt-2 pb-2 px-3 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-200 flex flex-col gap-1`} onClick={showModal}>
        <HabitsCardHeader habit={habit} />
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 text-sm mr-1">
            <CalendarToday />
            <span>
              {habit.granularity}
              {habit.granularity_times > 1 && ` (${habit.granularity_times} times)`}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <SlotsCompletionChip completion={slot.completion} count={slot.count} active_to={slot.active_to} />
          </div>
        </div>
      </div>

      <SlotDetailsModal ref={modalRef} habit={habit} slot={slot} />
    </>
  ) : null
}