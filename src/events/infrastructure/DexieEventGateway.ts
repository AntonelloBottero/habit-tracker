import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { EventMapper, EventRawProps } from "../mappers/EventMapper"
import { EventProps } from "../domain/Event"
import { EventGateway } from "../contracts/gateways"
import Dexie from "dexie"
import { DbResourceSchema } from "@/src/shared/infrastructure/DbClass"

export class DexieEventGateway extends DexieBaseGateway<EventRawProps, EventProps> implements EventGateway {
    constructor(db: Dexie) {
        super(db, 'event', new EventMapper())
    }

    private _isoToDate(iso: string): string {
        return iso.split('T')[0]
    }

    public async findOverlapping(habitId: string | number, date: Date, habitIdToExclude?: string | number): Promise<EventProps | null> {
        const dateStr = this._isoToDate(date.toISOString())
        return await this._table.where((item: DbResourceSchema<EventRawProps>) => 
            item.habit_id === habitId &&
            habitIdToExclude !== item.habit_id &&
            dateStr === this._isoToDate(item.date)
        ).first()
    }
}