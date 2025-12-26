import { HabitsSchema } from "@/db/DbClass"

interface Props {
    habit: HabitsSchema & { id: number }
}

export default function HabitsCard({ habit }: Props) {
  return habit ? (
    <div className="ht-interaction p-6 bg-white shadow-ht">
      {habit.name}
    </div>
  ) : null
}