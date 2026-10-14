import { SlotGateway } from "../contracts/gateways"
import { SlotProps } from "../domain/Slot"

export interface IndexEventableSlotsInputDTO {
    date: Date
}

export type IndexEventableSlotsOutputDTO = SlotProps[]

export class IndexEventableSlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }

    async execute({ date }: IndexEventableSlotsInputDTO): Promise<IndexEventableSlotsOutputDTO> {
        return await this._gateway.indexEventables(date)
    }
}