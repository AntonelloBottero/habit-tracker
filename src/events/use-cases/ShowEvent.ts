import { type EventProps } from '../domain/Event'
import { EventGateway } from '../contracts/gateways'

export type ShowHabitOutputDTO = EventProps

export class ShowEvent {
    private _gateway: EventGateway

    constructor(gateway: EventGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number): Promise<ShowHabitOutputDTO> {
        // input validations
        const storedEvent = await this._gateway.show(id)
        if(!storedEvent) {
            throw new Error(`The event to be shown doesn't exists.`)
        }

        return storedEvent
    }
}