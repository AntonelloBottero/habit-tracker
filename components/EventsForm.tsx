import { DbResourceSchema, EventsSchema } from "@/db/DbClass"
import { Rules, validators } from "@/hooks/useForm"

type Values = Partial<DbResourceSchema<EventsSchema>>

interface Props {
    values?: Values
    onSave?: () => never | void
    onDelete?: () => never | void
}

const rules: Rules = {
  habit_id: [validators.required]
}

export default function FormEvents({ values, onSave, onDelete }: Props) {
  return (
    <div>FormEvents</div>
  )
}