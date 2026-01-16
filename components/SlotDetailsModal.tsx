import { useRef } from "react"
import { DbResourceSchema, HabitsSchema, SlotsSchema } from "@/db/DbClass"
import Modal from "@/components/Modal"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import { CalendarToday, CheckCircle } from "@project-lary/react-material-symbols-700-rounded"

interface Props {
  slot: DbResourceSchema<SlotsSchema>
  habit: DbResourceSchema<HabitsSchema>
  className?: string
}

export default function SlotDetailsModal({ slot, habit }: Props) {
  const modalRef = useRef<ModalRef>(null)

  return habit ? (
    <Modal ref={modalRef} title="Progress details" size="max-w-md" role="slot-details-modal">
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
          {habit.enough_amount && (
            <div className="flex items-center gap-1 text-sm mr-1">
              <CheckCircle />
              <span>
                {habit.enough_amount}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-t-1 border-stone-200" />
    </Modal>
  ) : null
}