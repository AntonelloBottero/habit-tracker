import {useState} from 'react'
import { useLayoutMount, useEventListener } from '@shined/react-use'

export type BreakpointKey = "sm" | "md" | "lg" | "xl" | "xxl"
type Breakpoints = Record<BreakpointKey, boolean>

const values = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
} as Record<string, number>

export default function useBreakpoints() { // Facade for react-use

  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [breakpoints, setBreakpoints] = useState<Breakpoints | undefined>(undefined)

  function updateState(): void {
    const width = window.screen.width

    setWindowWidth(width)

    setBreakpoints(Object.entries(values).reduce((r, [k, v]) => ({
      ...r,
      [k]: width >= v
    }), {}) as Breakpoints)
  }

  useLayoutMount(updateState)
  useEventListener(() => window, 'resize', updateState)

  return { windowWidth, breakpoints }
}