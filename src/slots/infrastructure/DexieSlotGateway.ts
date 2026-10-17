import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { SlotProps } from "../domain/Slot"
import { SlotMapper, type SlotRawProps } from "../mappers/SlotMapper"
import { SlotGateway } from "../contracts/gateways"
import Dexie from "dexie"
import { DbResourceSchema } from "@/src/shared/infrastructure/DbClass"

export class DexieSlotGateway extends DexieBaseGateway<SlotRawProps, SlotProps> implements SlotGateway {
    constructor(db: Dexie) {
        super(db, 'slots', new SlotMapper)
    }

    public async indexEventables(date: Date): Promise<SlotProps[]> {
        const isoDate = date.toISOString()
        const items = await this._table
            .where((item: DbResourceSchema<SlotRawProps>) =>
                item.event_ids.length < item.completion
                && isoDate >= item.active_from
                && isoDate <= item.active_to
            )
            .reverse()
            .sortBy('created_at')
        return items.map(item => this._mapper.toDomain(item)) as SlotProps[]
    }

    public async indexInRange(from: Date, to: Date): Promise<SlotProps[]> {
        const isoFrom = from.toISOString()
        const isoTo = to.toISOString()
        const items = await this._table
            .where((item: DbResourceSchema<SlotRawProps>) =>
                item.event_ids.length < item.completion
                && isoFrom <= item.active_to
                && isoTo >= item.active_from
            )
            .reverse()
            .sortBy('created_at')
        return items.map(item => this._mapper.toDomain(item)) as SlotProps[]
    }
}