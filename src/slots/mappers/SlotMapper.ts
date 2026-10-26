import { Mapper, RawProps } from "@/src/shared/contracts/mappers"
import { SlotProps } from "../domain/Slot"
import { BaseMapper } from "@/src/shared/mappers/BaseMapper"

export type SlotRawProps = RawProps & {
    habit_id: string | number
    event_ids: (string | number)[]
    count: number
    completion: number
    active_from: string
    active_to: string
}

export class SlotMapper extends BaseMapper implements Mapper<SlotRawProps, SlotProps> {
    public toDomain(raw: Partial<SlotRawProps>): Partial<SlotProps> {
        return {
            habitId: raw.habit_id,
            eventIds: raw.event_ids || [],
            count: raw.count,
            completion: raw.completion,
            activeFrom: raw.active_from ? new Date(raw.active_from) : undefined,
            activeTo: raw.active_to ? new Date(raw.active_to) : undefined,
            ...this._resourceProps(raw)
        }
    }

    public toRaw(domain: SlotProps): SlotRawProps {
        return {
            habit_id: domain.habitId,
            event_ids: domain.eventIds,
            count: domain.count,
            completion: domain.completion,
            active_from: domain.activeFrom.toISOString(),
            active_to: domain.activeTo.toISOString(),
            ...this._resourceRawProps(domain)
        }
    }
}