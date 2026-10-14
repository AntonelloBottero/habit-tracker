import { EventGateway } from "../contracts/gateways"
import { EventProps } from "../domain/Event"

export interface IndexInRangeEventsInputDTO {
    from: Date,
    to: Date
}

export type IndexInRangeEventsOutputDTO = Promise<EventProps[]>

export class IndexInRangeEvents {
    private _gateway: EventGateway

    constructor(gateway: EventGateway) {
        this._gateway = gateway
    }

    async execute({ from, to }: IndexInRangeEventsInputDTO): Promise<IndexInRangeEventsOutputDTO> {
        return await this._gateway.indexInRange(from, to)
    }
}