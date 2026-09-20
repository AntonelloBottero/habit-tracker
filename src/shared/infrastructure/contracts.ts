import { HabitRawProps } from "@/src/habits/mappers/HabitMapper"

// Component Refs
export interface HabitsFormRef {
  store: (values?: Partial<HabitRawProps>) => void
  update: (id: string | number) => Promise<void>
}