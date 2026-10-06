import { EventRawProps } from "@/src/events/mappers/EventMapper"
import { HabitRawProps } from "@/src/habits/mappers/HabitMapper"

// Component Refs
export interface HabitsFormRef {
  store: (values?: Partial<HabitRawProps>) => void
  update: (id: string | number) => Promise<void>
}

export interface EventsFormRef {
  store: (values?: Partial<EventRawProps>) => void
  update: (id: string | number) => Promise<void>
}