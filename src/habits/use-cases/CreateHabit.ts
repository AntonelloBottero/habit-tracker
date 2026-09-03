import { Habit, type HabitProps } from '../domain/Habit'
import { type SaveGateway } from '../../shared/gateways/contracts'

export type CreateHabitInputDTO = HabitProps & {}
export type CreateHabitOutputDTO = HabitProps & {
    createdAt: Date
}

export type CreateHabitGateway = SaveGateway<CreateHabitInputDTO> & {
    findByName: (name: string) => Promise<CreateHabitOutputDTO | null>
}

export class CreateHabit {
    private _saveGateway: CreateHabitGateway

    constructor(saveGateway: CreateHabitGateway) {
        this._saveGateway = saveGateway
    }
}