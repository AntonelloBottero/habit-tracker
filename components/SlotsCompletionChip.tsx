import { DateTime } from "luxon"
import { useMemo } from "react"

interface Props {
	completion: number,
	count: number,
  active_to: string
}

export default function SlotsCompletionChip({ completion, count, active_to }: Props) {
  const now = DateTime.now().toISO()
  const expired = useMemo(() => {
    return active_to < now
  }, [active_to])

  const bgColor = useMemo(() => {
    if(completion >= count) {
      return 'bg-green-200'
    }
    return !expired ? 'bg-neutral-200' : 'bg-red-300'
  }, [completion, count, expired])

  return (
    <span className={`${bgColor} py-0.5 px-2 rounded-xl text-xs`}>
      <b>{completion}</b>/{count}
    </span>
  )
}