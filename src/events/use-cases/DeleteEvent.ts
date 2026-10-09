import { EventGateway } from '../contracts/gateways'

export type DeleteEventOutputDTO = void

export class DeleteHabit {
    private _gateway: EventGateway

    constructor(gateway: EventGateway) {
        this._gateway = gateway
    }

    public async execute(id: string | number): Promise<DeleteEventOutputDTO> {
        // input validations
        const storedEvent = await this._gateway.show(id)
        if(!storedEvent) {
            throw new Error(`The event to be deleted doesn't exists.`)
        }

        await this._gateway.delete(id)
    }
}