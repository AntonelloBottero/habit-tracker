import { HabitsSchema } from "@/db/DbClass"
import { NorthEast, SouthEast, CalendarToday, CheckCircle } from "@project-lary/react-material-symbols-700-rounded"
import TonalIcon from '@/components/TonalIcon'

interface Props {
    habit: HabitsSchema & { id: number }
    className?: string
    onClick?: () => void | never
}

export default function HabitsCard({ habit, className = '', onClick }: Props) {
  function handleOnClick() {
    if(typeof onClick === 'function') {
      onClick()
    }
  }

  return habit ? (
    <div className={`${className} ht-interaction py-3 px-4 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-100 flex flex-col gap-2`} onClick={() => { handleOnClick()}}>
      <div className="flex items-center gap-2">
        <div className="grow mr-2">
          {habit.name}
        </div>
        <TonalIcon color={habit.color} icon={(
          habit.type !== 'bad' ? <NorthEast className="text-xl" /> : <SouthEast className="text-xl" />
        )} />
      </div>
      <div className="flex items-center flex-wrap gap-3">
        <div className="flex items-center gap-1 text-sm">
          <CalendarToday />
          <span>
            {habit.granularity}
            {habit.granularity_times > 1 && ` (${habit.granularity_times} times)`}
          </span>
        </div>
        {habit.enough_amount && (
          <div className="flex items-center gap-1 text-sm">
            <CheckCircle />
            <span>
              {habit.enough_amount}
            </span>
          </div>
        )}
      </div>
    </div>
  ) : null
}