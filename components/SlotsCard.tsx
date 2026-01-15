import HabitsCardHeader from "@/components/HabitsCardHeader"
import { SlotWithHabit } from "@/app/types"

interface Props {
  slot: SlotWithHabit
  className?: string
}

export default function SlotsCard({ slot, className = '' }: Props) {
  return slot ? (
    <>
      <div className={`${className} ht-interaction pt-2 pb-3 px-4 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-200 flex flex-col gap-2`}>
        <HabitsCardHeader habit={slot.habit} />
      </div>
    </>
  ) : null
}