import { HabitProps } from "@/src/habits/domain/Habit"
import { SlotGateway } from "../contracts/gateways"

export interface IndexInRangeSlotsInputDTO {
    habits: HabitProps[]
    date: Date
}

export class IndexInRangeSlots {
    private _gateway: SlotGateway

    constructor(gateway: SlotGateway) {
        this._gateway = gateway
    }

    async execute({ habits, date }: IndexInRangeSlotsInputDTO) {
        // TODO: refactor useHabits.fetchSelectableHabits
    }
}