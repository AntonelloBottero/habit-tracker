import { BaseGateway } from "../../shared/contracts/gateways";
import { type HabitProps } from "../domain/Habit";
import { type HabitRawProps } from "../mappers/HabitMapper";

export type HabitGateway = BaseGateway<HabitRawProps, HabitProps> & {
    findByName: (name: string, id?: string | number) => Promise<HabitProps | null>
    indexSetuppables: () => Promise<HabitProps[]>
}