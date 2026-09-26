import { Mapper } from "@/src/shared/contracts/mappers"
import { SlotProps } from "../domain/Slot"

export interface SlotRawProps {
    id: string | number
    habit_id: string | number
    event_ids: (string | number)[]
    count: number
    completion: number
    active_to: string
}

export class SlotMapper implements Mapper<SlotRawProps, SlotProps> {
    public toDomain(raw: Partial<SlotRawProps>): Partial<SlotProps> {
        return {
            id: raw.id,
            habitId: raw.habit_id,
            eventIds: raw.event_ids || [],
            count: raw.count,
            completion: raw.completion,
            activeTo: raw.active_to ? new Date(raw.active_to) : undefined
        }
    }

    public toRaw(domain: SlotProps): SlotRawProps {
        return {
            id: domain.id,
            habit_id: domain.habitId,
            event_ids: domain.eventIds,
            count: domain.count,
            completion: domain.completion,
            active_to: domain.activeTo.toISOString()
        }
    }
}