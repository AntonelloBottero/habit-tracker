import { HabitProps } from "@/src/habits/domain/Habit"
import { SlotGateway } from "../contracts/gateways"

export interface IndexInRangeSlotsInputDTO {
    date: Date
}

export class IndexEventableSlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }

    async execute({ date }: IndexInRangeSlotsInputDTO) {
        return await this._gateway.indexEventables(date)
    }
}