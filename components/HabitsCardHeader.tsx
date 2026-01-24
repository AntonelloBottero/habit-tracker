import { DbResourceSchema, HabitsSchema } from "@/db/DbClass"
import TonalIcon from '@/components/TonalIcon'
import { NorthEast, SouthEast } from "@project-lary/react-material-symbols-700-rounded"

interface Props {
    habit: DbResourceSchema<HabitsSchema>
    dense?: boolean
    className?: string
}

export default function HabitsCardHeader({ habit, className = '', dense = false }: Props) {
  const icon = habit.type !== 'bad' ? (
    <NorthEast className="text-xl" />
  ) : (
    <SouthEast className="text-xl" />
  )

  return habit ? (
    <div className={`${className} flex items-center gap-2`}>
      <div className={`${!dense ? 'text-base' : 'text-sm'} grow font-bold mr-2`}>
        {habit.name}
      </div>
      {!dense ? (
        <TonalIcon color={habit.color} icon={(icon)} className="-my-1" />
      ) : (
        <span style={{color: habit.color}}>
          {icon}
        </span>
      )}
    </div>
  ) : null
}