import { useState, useEffect, useMemo, type ReactNode, type ChangeEvent } from 'react'
import useBreakpoints, { type BreakpointKey } from '@/hooks/ueBreakpoints'

interface Props {
    value: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    breakpoint?: BreakpointKey
    width?: string // 300px, 70%, ecc
    align?: 'left' | 'right'
    bordered?: boolean
    title?: string,
    children?: ReactNode
}

export default function Sidebar({ value, onChange, breakpoint = 'md', width = '256px', align = 'left', bordered = true, title, children }: Props) {
  const { breakpoints } = useBreakpoints()

  useEffect(() => {
    if(onChange) {
      onChange({
        target: {
          value: breakpoints ? breakpoints[breakpoint] : false
        }
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }, [breakpoint, breakpoints])

  const className = useMemo(() => {
    return [
      { class: 'border-r-1', value: bordered && align === 'left' },
      { class: 'border-l-1', value: bordered && align === 'right' },
      { class: 'border-stone-200', value: bordered }
    ].filter(cn => cn.value).map(cn => cn.class).join(' ')
  }, [bordered, align])

  return value ? (
    <aside className={`${className} gradient-primary h-full min-h-[100vh] flex-shrink self-stretch overflow-y-auto z-10`} style={{ maxWidth: width, flexBasis: width }}>
      <div className="py-4 px-4 flex flex-col gap-4">
        {title && (
          <div className="text-xl font-monda font-bold my-2">
            {title}
          </div>
        )}
        {children}
      </div>
    </aside>
  ) : null
}