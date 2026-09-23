import { type HabitProps, type Type, type Granularity } from "../domain/Habit"
import { DomainProps, RawProps, type Mapper } from "../../shared/contracts/mappers";

export interface HabitRawProps {
    id: string | number
    user_id: string | number
    type: Type
    name: string
    color: string
    granularity: Granularity
    include_weekends: boolean
    granularity_times: number
    enough_amount: string
    last_managed_at: string | null
}

export class HabitMapper implements Mapper<HabitRawProps, HabitProps> {
    public toDomain(raw: Partial<HabitRawProps>): Partial<HabitProps> {
        return {
            id: raw.id,
            userId: raw.user_id,
            type: raw.type,
            name: raw.name,
            color: raw.color,
            granularity: raw.granularity,
            includeWeekends: raw.include_weekends,
            granularityTimes: raw.granularity_times,
            enoughAmount: raw.enough_amount,
            lastManagedAt: raw.last_managed_at ? new Date(raw.last_managed_at) : null,
        }
    }

    public toRaw(domain: HabitProps): HabitRawProps {
        return {
            id: domain.id,
            user_id: domain.userId,
            type: domain.type,
            name: domain.name,
            color: domain.color,
            granularity: domain.granularity,
            include_weekends: domain.includeWeekends,
            granularity_times: domain.granularityTimes,
            enough_amount: domain.enoughAmount,
            last_managed_at: domain.lastManagedAt?.toISOString() ?? null,
        }
    }
}