/**
 * 1. manage menu with FloatingMenu
 * 2. Manage default colors with a predefined set with the custom colors picked by the user
 * 3. Export util to save in the options the custom colors user picks
 */
import { useState, ChangeEvent } from 'react'
import FloatingMenu from "@/components/FloatingMenu"

interface Props {
    id?: string
    name: string
    value: string
    placeholder?: string
    className?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const defaultColors = [
    '#E6AF2E',
    '#137547',
    '#29335C',
    '#B4ADEA',
    '#84A9C0'
]

export default function ColorPicker(props: Props) {
    const [custom, setCustom] = useState(false)

    return (
        <FloatingMenu reference={(<input {...props} />)}>
            Color picker
        </FloatingMenu>
    )
}