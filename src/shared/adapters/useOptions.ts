import { defaultColors } from "@/utils/constants";
import { useInfrastructure } from "../infrastructure/InfrastructureContext";

export default function useOptions() {
    const { options, updateOption } = useInfrastructure()
    const colors = [...options.colors, ...defaultColors]

    async function addColor(color: string): Promise<void> {
        if(colors.includes(color)) { return undefined }

        try {
            updateOption('colors', [...colors, color])
        } catch(error) {
            console.error(error)
        }
    }

    return {
        colors,
        addColor
    }
}