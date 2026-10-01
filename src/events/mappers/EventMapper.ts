import { Mapper } from "@/src/shared/contracts/mappers"
import { EventProps } from "../domain/Event"

export interface EventRawProps {
    id: string | number
    habit_id: string | number
    date: string
    completed: number
}

export class EventMapper implements Mapper<EventRawProps, EventProps> {
    public toDomain(raw: Partial<EventRawProps>): Partial<EventProps> {
        return {
            id: raw.id,
            habitId: raw.habit_id,
            date: raw.date ? new Date(raw.date): undefined,
            completed: raw.completed
        }
    }

    public toRaw(domain: EventProps): EventRawProps {
        return {
            id: domain.id,
            habit_id: domain.habitId,
            date: domain.date.toISOString(),
            completed: domain.completed
        }
    }
}