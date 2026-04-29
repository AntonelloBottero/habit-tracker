import { DateTime } from "luxon"
import HabitsCardHeader from "@/components/HabitsCardHeader"
import SlotsCompletionChip from "@/components/SlotsCompletionChip"
import { HabitWithSlots, ModalRef } from "@/app/types"
import { useState, useRef } from "react"
import { CalendarToday, CheckCircle } from "@project-lary/react-material-symbols-700-rounded"
import Modal from "@/components/Modal"
import SlotDetailsModal from "@/components/SlotDetailsModal"
import useHabits from "@/hooks/useHabits"
import { DbResourceSchema, SlotsSchema } from "@/db/DbClass"

interface Props {
  habit: HabitWithSlots
  className?: string
}

export default function CompressedSlotsCard({ habit, className = '' }: Props) {
  const slots = habit?.slots ?? []

  const count = slots.reduce((r, slot) => r += Number(slot.count), 0)
  const completion = slots.reduce((r, slot) => r += slot.completion, 0)
  const activeTo = slots[slots.length - 1]?.active_to

  const modalRef = useRef<ModalRef>(null)
  const { calculateMonthlySlots } = useHabits()
  function handleCardClick() {
    modalRef.current?.show()
    calculateMonthlySlots(habit, DateTime.now().toISO())
  }

  // --- Selected slot (SlotDetailModal)
  const selectedSlotModalRef = useRef<ModalRef>(null)
  const [selectedSlot, setSelectedSlot] = useState<DbResourceSchema<SlotsSchema> | null>(null)

  function showSlotDetail(slot: DbResourceSchema<SlotsSchema>) {
    setSelectedSlot(slot)
    setTimeout(() => {
      selectedSlotModalRef.current?.show()
    })
  }

  return habit ? (
    <>
      <div className={`${className} ht-interaction pt-2 pb-2 px-3 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-200 flex flex-col gap-1`} onClick={handleCardClick}>
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
          {slots.length > 0 && (
            <div className="flex items-center gap-1 -mb-0.5">
              <SlotsCompletionChip completion={completion} count={count} active_to={activeTo} />
            </div>
          )}
        </div>
      </div>

      <Modal ref={modalRef} title="Overall progress" size="max-w-lg" role="compressed-slots-modal">
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
          <div className="w-full border-t-1 border-stone-200 my-2" />
          <div className="flex flex-wrap items-center gap-3">
            <div className="grow w-full font-bold">
              Progress details
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-body">
              <thead className="text-sm text-body bg-neutral-secondary-soft rounded-base">
                <tr>
                  <th className="px-3 py-1.5 text-gray-500 font-bold">Date</th>
                  <th className="px-3 py-1.5 text-right text-gray-500 font-bold" style={{ width: '90px', maxWidth: '90px' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.id} className="bg-neutral-primary border-t border-stone-200 cursor-pointer hover:bg-stone-100"  onClick={() => { showSlotDetail(slot) }}>
                    <td className="px-3 py-1.5">
                      {DateTime.fromISO(slot.active_to).toFormat('dd/MM/yyyy')}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <SlotsCompletionChip count={slot.count} completion={slot.completion} active_to={slot.active_to} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <SlotDetailsModal ref={selectedSlotModalRef} habit={habit} slot={selectedSlot} />
    </>
  ) : null
}