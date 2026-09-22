import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext";
import { IndexSetuppablesHabits } from "../use-cases/IndexSetuppableHabits";

export default function useHabitsSetup() {
    const { habitGateway } = useInfrastructure()

    async function setup() {
        const setuppableHabits = new IndexSetuppablesHabits(habitGateway).execute()
    }
}