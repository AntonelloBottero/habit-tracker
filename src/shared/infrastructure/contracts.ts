import { EventRawProps } from "@/src/events/mappers/EventMapper"
import { HabitRawProps } from "@/src/habits/mappers/HabitMapper"
import { SlotRawProps } from "@/src/slots/mappers/SlotMapper"
import { ChangeEvent } from "react"

// Component Refs
export interface ModalRef {
  show: () => void
  hide: () => void
}

export interface ConfirmModalRef {
  confirm: () => Promise<unknown>
}

export interface SidebarRef {
  toggle: (show: boolean) => void
}

export interface FormFieldProps {
  id?: string
  name: string
  value?: string
  defaultChecked? : boolean
  placeholder?: string
  className?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface HabitsFormRef {
  store: (values?: Partial<HabitRawProps>) => void
  update: (id: string | number) => Promise<void>
}

export interface EventsFormRef {
  store: (values?: Partial<EventRawProps>) => void
  update: (id: string | number) => Promise<void>
}

export interface EventDetailsModalRef {
  show: (_event: EventRawProps, _habit: HabitRawProps) => void
  hide: () => void
}

export interface SlotDetailsModalRef {
  show: (_slot: SlotRawProps, _habit: HabitRawProps) => void
  hide: () => void
}