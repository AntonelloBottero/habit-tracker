import { DateTime } from "luxon"

interface Props {
	completion: number,
	count: number,
  active_to: string
}

export default function SlotsCompletionChip({ completion, count, active_to }: Props) {
  const now = DateTime.now().toISO()
  const expired = active_to < now

  const bgColor = (() => {
    if(completion >= count) {
      return 'bg-green-200'
    }
    return !expired ? 'bg-slate-300' : 'bg-red-300'
  })()

  return (
    <span className={`${bgColor} py-0.5 px-2 rounded-xl text-xs`}>
      <b>{completion}</b>/{count}
    </span>
  )
}