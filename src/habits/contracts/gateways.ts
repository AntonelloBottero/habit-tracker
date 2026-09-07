import { BaseGateway } from "../../shared/contracts/gateways";
import { HabitProps } from "../domain/Habit";

export type HabitGateway = BaseGateway<HabitProps> & {
    findByName: (name: string, id?: string | number) => Promise<HabitProps | null>
}