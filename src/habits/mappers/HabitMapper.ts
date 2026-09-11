import { type HabitProps, type Type, type Granularity } from "../domain/Habit"
import { type RawProps, type DomainProps, type Mapper } from "../../shared/contracts/mappers";

export interface HabitRawProps extends RawProps {
    id?: string | number
    user_id?: string | number
    type: Type
    name: string
    color: string
    granularity: Granularity
    include_weekends: boolean
    granularity_times: number
    enough_amount: string
    manage_from: string | null
}

export class HabitMapper implements Mapper {
    public static toDomain(raw: Partial<HabitRawProps>): Partial<HabitProps> {
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
            manageFrom: raw.manage_from ? new Date(raw.manage_from) : null
        }
    }

    public static toRaw(domain: HabitProps): HabitRawProps {
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
            manage_from: domain.manageFrom?.toISOString() ?? null
        }
    }
}