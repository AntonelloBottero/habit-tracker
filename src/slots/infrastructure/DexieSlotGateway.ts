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

    public async indexInRange(date: Date): Promise<SlotProps[]> {
        const items = await this._table.where((item: DbResourceSchema<SlotRawProps>) => {
            
        }).toArray()
        return items.map(item => this._mapper.toDomain(item)) as SlotProps[]
    }
}