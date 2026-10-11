import { useInfrastructure } from "../infrastructure/InfrastructureContext";

export default function useOptions() {
    const { options, updateOption } = useInfrastructure()

    async function addColor(color: string): Promise<void> {
        if(options.colors.includes(color)) { return undefined }

        try {
            updateOption('colors', [...options.colors, color])
        } catch(error) {
            console.error(error)
        }
    }

    return {
        colors: options.colors,
        addColor
    }
}