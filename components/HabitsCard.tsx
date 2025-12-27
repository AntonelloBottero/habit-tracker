import { HabitsSchema } from "@/db/DbClass"
import { ArrowOutward } from "@project-lary/react-material-symbols-700-rounded"

interface Props {
    habit: HabitsSchema & { id: number }
}

export default function HabitsCard({ habit }: Props) {
  return habit ? (
    <div className="ht-interaction p-6 bg-white shadow-ht">
      <ArrowOutward className="text-xl" />
      {habit.name}
    </div>
  ) : null
}