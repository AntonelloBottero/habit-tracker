import { DbResourceSchema, EventsSchema, HabitsSchema } from "@/db/DbClass"
import { DateTime } from "luxon"

interface Props {
	habit: DbResourceSchema<HabitsSchema>
	event: DbResourceSchema<EventsSchema>
}

export default function EventsCard({ habit, event }: Props) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {habit && <span className="w-3 h-3 rounded-lg" style={{ backgroundColor: habit.color }} />}
      <div className="-mt-1 flex flex-wrap">
        {event && (<span className="mr-1">{DateTime.fromISO(event.datetime).toFormat('dd/MM/yyyy HH:ii')}</span>)}
        {habit && (<b>{habit.name}</b>)}
      </div>
    </div>
  )
}