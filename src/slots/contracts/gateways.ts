import { BaseGateway } from "../../shared/contracts/gateways"
import { type SlotProps } from "../domain/Slot"
import { type SlotRawProps } from "../mappers/SlotMapper"

export type SlotGateway = BaseGateway<SlotRawProps, SlotProps> & {
    indexEventables: (date: Date) => Promise<SlotProps[]> // slots that can be linked to an event (active and still to complete)
}