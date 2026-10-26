import { type Granularity } from "@/src/shared/contracts/consts";
import { type HabitProps, type Type } from "../domain/Habit"
import { RawProps, type Mapper } from "../../shared/contracts/mappers";
import { BaseMapper } from "@/src/shared/mappers/BaseMapper";

export type HabitRawProps = RawProps & {
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

export class HabitMapper extends BaseMapper implements Mapper<HabitRawProps, HabitProps> {
    public toDomain(raw: Partial<HabitRawProps>): Partial<HabitProps> {
        return {
            userId: raw.user_id,
            type: raw.type,
            name: raw.name,
            color: raw.color,
            granularity: raw.granularity,
            includeWeekends: raw.include_weekends,
            granularityTimes: raw.granularity_times,
            enoughAmount: raw.enough_amount,
            lastManagedAt: raw.last_managed_at ? new Date(raw.last_managed_at) : undefined,
            ...this._resourceProps(raw)
        }
    }

    public toRaw(domain: HabitProps): HabitRawProps {
        return {
            user_id: domain.userId,
            type: domain.type,
            name: domain.name,
            color: domain.color,
            granularity: domain.granularity,
            include_weekends: domain.includeWeekends,
            granularity_times: domain.granularityTimes,
            enough_amount: domain.enoughAmount,
            last_managed_at: domain.lastManagedAt?.toISOString() ?? null,
            ...this._resourceRawProps(domain)
        }
    }
}