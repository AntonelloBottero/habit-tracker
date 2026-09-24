import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext";
import { IndexManageableHabits } from "../use-cases/IndexManageableHabits";

export default function useHabitsSetup() {
    const { habitGateway } = useInfrastructure()

    async function setup() {
        const manageableHabits = await new IndexManageableHabits(habitGateway).execute()
    }

    return {
        setup
    }
}