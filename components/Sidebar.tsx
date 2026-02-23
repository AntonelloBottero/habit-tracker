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

  const hasBreakpoint = useMemo(() => {
    return breakpoints ? breakpoints[breakpoint] : false
  }, [breakpoint, breakpoints])

  useEffect(() => {
    if(onChange) {
      onChange({
        target: {
          value: hasBreakpoint
        }
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
  }, [hasBreakpoint])

  const asideClassName = useMemo(() => {
    return [
      { class: 'fixed w-full h-full flex z-10', value: !hasBreakpoint },
      { class: 'justify-end', value: !hasBreakpoint && align === 'right' }
    ].filter(cn => cn.value).map(cn => cn.class).join(' ')
  }, [hasBreakpoint, align])

  const contentClassName = useMemo(() => {
    return [
      { class: 'border-r-1', value: bordered && align === 'left' },
      { class: 'border-l-1 ml-auto', value: bordered && align === 'right' },
      { class: 'border-stone-200', value: bordered }
    ].filter(cn => cn.value).map(cn => cn.class).join(' ')
  }, [bordered, align])

  return value ? (
    <aside className={`${asideClassName} max-h-[100vh]`}>
      <div className={`${contentClassName} bg-white max-w-full h-full overflow-y-auto`} style={{ width }}>
        <div className="py-4 px-4 flex flex-col gap-4">
          {title && (
            <div className="text-xl font-monda font-bold my-2">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </aside>
  ) : null
}