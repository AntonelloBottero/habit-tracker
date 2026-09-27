/**
 * README: Adapters allow to orchestrate use cases by different components.
 * Since Use cases cannot be aware of eachoters, but many times they have to be used together when more components are involved in a process, Adapters become the best place to use them together
 */

import { useInfrastructure } from "../infrastructure/InfrastructureContext";
import { IndexManageableHabits } from "@/src/habits/use-cases/IndexManageableHabits";
import { StoreMonthlySlots } from "@/src/slots/use-cases/StoreMonthlySlots";
import { ShiftManagedHabits } from "@/src/habits/use-cases/ShiftManagedHabits";

export default function useSetup() {
    const { habitGateway, slotGateway } = useInfrastructure()

    async function setup() {
        const manageableHabits = await new IndexManageableHabits(habitGateway).execute()
        if(!manageableHabits.length) { return undefined }

        await new StoreMonthlySlots(slotGateway).execute({ habits: manageableHabits, date: new Date() })
        await new ShiftManagedHabits(habitGateway)
    }

    return {
        setup
    }
}