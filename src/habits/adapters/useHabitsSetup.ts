import { useInfrastructure } from "@/src/shared/infrastructure/InfrastructureContext";
import { IndexManageableHabits } from "../use-cases/IndexManageableHabits";
import { StoreMonthlySlots } from "@/src/slots/use-cases/StoreMonthlySlots";

export default function useHabitsSetup() {
    const { habitGateway, slotGateway } = useInfrastructure()

    async function setup() {
        const manageableHabits = await new IndexManageableHabits(habitGateway).execute()
        if(!manageableHabits.length) { return undefined }

        await new StoreMonthlySlots(slotGateway)

        // TODO: bulkUpdate habits.lastManagedAt
    }

    return {
        setup
    }
}