import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { SlotProps } from "../domain/Slot"
import { SlotMapper, type SlotRawProps } from "../mappers/SlotMapper"
import { SlotGateway } from "../contracts/gateways"
import Dexie from "dexie"
import { DbResourceSchema } from "@/src/shared/infrastructure/DbClass"

export class DexieSlotGateway extends DexieBaseGateway<SlotRawProps, SlotProps> implements SlotGateway {
    constructor(db: Dexie) {
        super(db, 'slot', new SlotMapper)
    }

    public async indexEventables(date: Date): Promise<SlotProps[]> {
        const isoDate = date.toISOString()
        const items = await this._table.where((item: DbResourceSchema<SlotRawProps>) => item.event_ids.length < item.completion && isoDate >= item.active_from && isoDate <= item.active_to).toArray()
        return items.map(item => this._mapper.toDomain(item)) as SlotProps[]
    }
}