import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { SlotProps } from "../domain/Slot"
import { SlotMapper, type SlotRawProps } from "../mappers/SlotMapper"
import { SlotGateway } from "../contracts/gateways"
import Dexie from "dexie"

export class DexieSlotGateway extends DexieBaseGateway<SlotRawProps, SlotProps> implements SlotGateway {
    constructor(db: Dexie) {
        super(db, 'slot', new SlotMapper)
    }
}