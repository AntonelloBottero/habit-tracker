import { useMemo } from "react"

interface Props {
	completion: number,
	count: number
	expired?: boolean
}

export default function SlotsSelectionChip({ completion, count, expired = false }: Props) {
  const bgColor = useMemo(() => {
    if(expired) { return 'bg-red-200' }
    return completion < count ? 'bg-neutral-200' : 'bg-green-200'
  }, [completion, count, expired])

  return (
    <span className={`${bgColor} py-1 px-2 rounded-xl text-xs`}>
      <b>{completion}</b>/{count}
    </span>
  )
}