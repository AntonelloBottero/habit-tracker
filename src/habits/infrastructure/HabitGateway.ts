import { DexieBaseGateway } from "@/src/shared/infrastructure/gateways"
import { HabitMapper } from "../mappers/HabitMapper"

export class HabitGateway extends DexieBaseGateway {
    constructor() {
        super('habit', new HabitMapper())
    }
}