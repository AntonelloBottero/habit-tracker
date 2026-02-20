import {useState} from 'react'
import { useBreakpoints, useLayoutMount, useEventListener } from '@shined/react-use'

export type BreakpointKey = "sm" | "md" | "lg" | "xl" | "xxl"
type Breakpoints = Record<BreakpointKey, boolean>

const values = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
} as Record<string, number>

export default function useBreakpointsFacade() { // Facade for react-use
  const { isGreaterOrEqual } = useBreakpoints(values)

  const [breakpoints, setBreakpoints] = useState<Breakpoints>({})
  function updateBreakpoints(): void {
    setBreakpoints(Object.keys(values).reduce((r, k) => ({
      ...r,
      [k]: isGreaterOrEqual(k)
    }), {}) as Breakpoints)
  }

  useLayoutMount(updateBreakpoints)
  useEventListener(() => window, 'resize', updateBreakpoints)

  return { breakpoints }
}