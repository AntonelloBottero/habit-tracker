import { DbResourceSchema, HabitsSchema } from "@/db/DbClass"
import { CalendarToday, CheckCircle } from "@project-lary/react-material-symbols-700-rounded"
import HabitsCardHeader from "@/components/HabitsCardHeader"

interface Props {
    habit: DbResourceSchema<HabitsSchema>
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
    <div className={`${className} ht-interaction pt-2 pb-3 px-4 rounded-lg bg-green-50 outline-1 outline-offset-1 outline-green-200 flex flex-col gap-2`} onClick={() => { handleOnClick() }}>
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
  ) : null
}