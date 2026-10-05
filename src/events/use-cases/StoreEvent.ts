import { EventGateway } from "../contracts/gateways"
import { Event, EventProps } from "../domain/Event"

export type StoreEventInputDTO = Omit<EventProps, 'id'>
export type StoreEventOutputDTO = EventProps

export class StoreEvent {
    private _gateway: EventGateway

    constructor(gateway: EventGateway) {
        this._gateway = gateway
    }

    public async execute(input: StoreEventInputDTO): Promise<StoreEventOutputDTO> {
        const overlappingEvent = await this._gateway.findOverlapping(input.habitId, input.date)
        if (overlappingEvent) {
            throw new Error(`Another event with same habit already exists in this day.`);
        }

        const id = this._gateway.generateId()
        const event = new Event({...input, id })

        const data = {...event.toPrimitives() }
        await this._gateway.store(data)

        return data
    }
}