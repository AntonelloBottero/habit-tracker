import { HabitsSchema } from "@/db/DbClass"
import { ArrowOutward } from "@project-lary/react-material-symbols-700-rounded"
import TonalIcon from '@/components/TonalIcon'

interface Props {
    habit: HabitsSchema & { id: number }
}

export default function HabitsCard({ habit }: Props) {


  return habit ? (
    <div className="ht-interaction py-3 px-4 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-100 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <TonalIcon color={habit.color} icon={<ArrowOutward className="text-xl" />} />
        <div>
          {habit.name}
          <span className="ml-2 inline-block w-3 h-3 rounded-xl" style={{backgroundColor: habit.color}} />
        </div>
      </div>
      <div className="flex align-center flex-wrap ga-2">

      </div>
    </div>
  ) : null
}