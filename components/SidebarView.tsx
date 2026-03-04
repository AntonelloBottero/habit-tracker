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
		content: ReactNode | ReactNode[] // content of the sidebar
    children: ReactNode | ReactNode[] // view content
}

export default function SidebarView({ value, onChange, breakpoint = 'md', width = '256px', align = 'left', bordered = true, title, content, children }: Props) {
  // --- Manage breakpoint ---
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

  // --- JSX attrs ---
  const transitionClassName = 'duration-500 ease-in-out'

  const wrapperAttrs = useMemo(() => {
    return {
      style: {
        paddingLeft: value && hasBreakpoint && align === 'left' ? width : '0px',
        paddingRight: value && hasBreakpoint && align === 'right' ? width : '0px'
      }
    }
  }, [value, align, width, hasBreakpoint])

  const childrenWrapperAttrs = useMemo(() => {
    return {
      className: [
        { class: `transition-${align}`, value: true },
        { class: transitionClassName, value: !hasBreakpoint },
        { class: 'min-w-full max-h-full overflow-y-auto relative z-2', value: true }
      ].filter(cn => cn.value).map(cn => cn.class).join(' '),
      style: {
        [align]: value && !hasBreakpoint ? width : '0px',
      }
    }
  }, [value, hasBreakpoint, width, align])

  const asideAttrs = useMemo(() => {
    return {
      className: [
        { class: 'border-r-1', value: bordered && align === 'left' },
        { class: 'border-l-1', value: bordered && align === 'right' },
        { class: 'border-stone-200', value: bordered },
        { class: `transition-${align}`, value: true },
        { class: `absolute top-0 h-full overflow-y-auto bg-white ${transitionClassName}`, value: true, }
      ].filter(cn => cn.value).map(cn => cn.class).join(' '),
      style: {
        width,
        [align]: !value ? `-${width}` : '0px'
      }
    }
  }, [value, width, bordered, align])

  return (
    <div {...wrapperAttrs} className={`w-full h-full min-h-full relative overflow-hidden transition-padding ${transitionClassName}`}>
      <div {...childrenWrapperAttrs}>
        {children}
        {value && !hasBreakpoint && (
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-90 z-3">
          </div>
        )}
      </div>

      <aside {...asideAttrs}>
        <div className="py-4 px-4 flex flex-col gap-4">
          {title && (
            <div className="text-xl font-monda font-bold my-2">
              {title}
            </div>
          )}
          {content}
        </div>
      </aside>
    </div>
  )
}