import { Mapper, RawProps } from "@/src/shared/contracts/mappers"
import { EventProps } from "../domain/Event"
import { BaseMapper } from "@/src/shared/mappers/BaseMapper"

export type EventRawProps = RawProps & {
    habit_id: string | number
    date: string
    completed: number
}

export class EventMapper extends BaseMapper implements Mapper<EventRawProps, EventProps> {
    public toDomain(raw: Partial<EventRawProps>): Partial<EventProps> {
        return {
            habitId: raw.habit_id,
            date: raw.date ? new Date(raw.date): undefined,
            completed: raw.completed,
            ...this._resourceProps(raw)
        }
    }

    public toRaw(domain: EventProps): EventRawProps {
        return {
            habit_id: domain.habitId,
            date: domain.date.toISOString(),
            completed: domain.completed,
            ...this._resourceRawProps(domain)
        }
    }
}