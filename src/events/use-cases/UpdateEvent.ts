import { Event, type EventProps } from '../domain/Event'
import { EventGateway } from '../contracts/gateways'
import { selectiveMerge } from '../../shared/utils/obj'

export type UpdateEventInputDTO = Partial<Omit<EventProps, 'id'>>
export type UpdateEventOutputDTO = EventProps

export class UpdateEvent {
    private _gateway: EventGateway

    constructor(saveGateway: EventGateway) {
        this._gateway = saveGateway
    }

    public async execute(id: string | number, input: UpdateEventInputDTO): Promise<UpdateEventOutputDTO> {
        // input validations
        const storedEvent = await this._gateway.show(id)
        if(!storedEvent) {
            throw new Error(`The event to be updated doesn't exists.`)
        }

        const merged = selectiveMerge(storedEvent, input)

        const overlappingEvent = await this._gateway.findOverlapping(merged.habitId, merged.date)
        if (overlappingEvent) {
            throw new Error(`Another event with same habit already exists in this day.`);
        }

        const event = new Event(merged)

        return await this._gateway.update(id, event.toPrimitives())
    }
}