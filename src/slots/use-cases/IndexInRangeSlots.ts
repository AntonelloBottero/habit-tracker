import { HabitProps } from "@/src/habits/domain/Habit"
import { SlotGateway } from "../contracts/gateways"

export interface IndexInRangeSlotsInputDTO {
    date: Date
}

export class IndexInRangeSlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }

    async execute({ date }: IndexInRangeSlotsInputDTO) {
        // TODO: refactor useHabits.fetchSelectableHabits

    }
}