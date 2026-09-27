import { HabitGateway } from "../contracts/gateways"
import { Habit, HabitProps } from "../domain/Habit"

export interface ShiftManagedHabitsInputDTO {
    habits: HabitProps[]
    date?: Date
}

export class ShiftManagedHabits {
    private _gateway: HabitGateway

    constructor(gateway: HabitGateway) {
        this._gateway = gateway
    }

    public async execute({ habits, date = new Date() }: ShiftManagedHabitsInputDTO) {
        if(!habits.length) { return undefined }

        const lastManagedAt = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59) // lastManagedAt is an application logic, so we update it in use cases instead of domain
        const domainHabits = habits.map(habit => new Habit({
            ...habit,
            lastManagedAt
        }).toPrimitives()) // check if habits are proper and get a proper habit domain resource

        await this._gateway.bulkUpdate(domainHabits)
    }
}