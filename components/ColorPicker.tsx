import { defaultColors } from "@/utils/constants"

import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { useOptions } from "@/hooks/useOptions"

interface Props {
    id?: string
    name: string
    value: string
    placeholder?: string
    className?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function ColorPicker(props: Props) {
  const { getOption } = useOptions()

  const [userColors, setUserColors] = useState([])
  const getUserColors = async () => {
    const userColors = await getOption("user_colors")
    setUserColors(userColors || [])
  }
  const availableColors = useMemo(() => {
    return [...userColors, ...defaultColors]
  }, [userColors])

  const {value, onChange, ...inputProps } = props

  useEffect(() => {
    getUserColors()
  }, [])

  return (
    <div className="flex gap-2 flex-wrap center">
      <input
        placeholder="#ffffff"
        {...inputProps}
        value={value}
        onChange={onChange}
      />
      {availableColors.map(color => <button key={color} type="button" className="w-7 h-7 rounded-full" style={{backgroundColor: color}} />)}
    </div>
  )
}
