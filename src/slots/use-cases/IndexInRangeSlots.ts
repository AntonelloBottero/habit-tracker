import { SlotGateway } from "../contracts/gateways"
import { SlotProps } from "../domain/Slot"

export interface IndexInRangeSlotsInputDTO {
    from: Date,
    to: Date
}

export type IndexInRangeSlotsOutputDTO = Promise<SlotProps[]>

export class IndexInRangeSlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }

    async execute({ from, to }: IndexInRangeSlotsInputDTO): Promise<IndexInRangeSlotsOutputDTO> {
        return await this._gateway.indexInRange(from, to)
    }
}