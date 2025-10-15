/**
 * 1. manage menu with FloatingMenu
 * 2. Manage default colors with a predefined set with the custom colors picked by the user
 * 3. Export util to save in the options the custom colors user picks
 */
import { useState, ChangeEvent, useMemo } from 'react'
import { useOptions } from '@/hooks/useOptions'
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
  const { getOption } = useOptions()

  const [userColors, setUserColors] = useState([])
  const getUserColors = async () => {
    const userColors = await getOption('user_colors')
    setUserColors(userColors || [])
  }
  const availableColors = useMemo(() => {
    return [...userColors, ...defaultColors]
  }, [userColors])
  const handleFloatingMenuChange = (open: boolean) => { // fetches user colors each time menu is opened, so the colors are always updated
    if(open) {
      getUserColors()
    }
  }

  return (
    <FloatingMenu reference={(<input {...props} />)} onChange={(e) => handleFloatingMenuChange(e.target.value)}>
      <div className="flex gap-2">
        {availableColors.map(color => <button key={color} type="button" className="w-6 h-6 rounded-full" style={{backgroundColor: color}} />)}
      </div>
    </FloatingMenu>
  )
}