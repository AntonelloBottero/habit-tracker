import { EventGateway } from "../contracts/gateways"
import { EventProps } from "../domain/Event"

export interface IndexEventsByIdsInputDTO {
    ids: (string | number)[]
}
export type IndexEventsByIdsOutputDTO = EventProps[]

export class IndexEventsByIds {
    private _gateway: EventGateway

    constructor(gateway: EventGateway) {
        this._gateway = gateway
    }

    public async execute({ ids }: IndexEventsByIdsInputDTO): Promise<IndexEventsByIdsOutputDTO> {
        if(!ids.length) { return [] } // since Habit.eventIds exists and it may be empty, we abort safely if no events are linked to the habit

        return await this._gateway.indexByIds(ids)
    }
}