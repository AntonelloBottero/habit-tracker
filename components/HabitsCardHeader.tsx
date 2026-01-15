import { DbResourceSchema, HabitsSchema } from "@/db/DbClass"
import TonalIcon from '@/components/TonalIcon'
import { NorthEast, SouthEast } from "@project-lary/react-material-symbols-700-rounded"

interface Props {
    habit: DbResourceSchema<HabitsSchema>
    className?: string
}

export default function HabitsCardHeader({ habit, className = '' }: Props) {
  return habit ? (
    <div className={`${className} flex items-center gap-2`}>
      <div className="grow mr-2">
        {habit.name}
      </div>
      <TonalIcon color={habit.color} icon={(
        habit.type !== 'bad' ? <NorthEast className="text-xl" /> : <SouthEast className="text-xl" />
      )} />
    </div>
  ) : null
}