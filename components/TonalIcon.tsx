import { ReactElement } from "react"

interface Props {
    color?: string
    icon: ReactElement
    className?: string
}

export default function TonalIcon({ color, icon, className = '' }: Props) {
  return icon ? (
    <span className={`${className} inline-flex justify-center items-center w-6 h-6 ht-interaction ht-interaction--active rounded-full`} style={{ color }}>
      {icon}
    </span>
  ) : null
}