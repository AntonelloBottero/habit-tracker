/**
 * Color picker
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */
import { defaultColors } from "@/utils/constants"

import { useState, useEffect, useMemo } from "react"
import useOptions from "@/hooks/useOptions"
import { BookmarkIcon } from '@heroicons/react/24/solid'
import { FormFieldProps } from "@/app/types"



export default function ColorPicker(props: FormFieldProps) {
  // --- mixes default color with the ones chosen by the user in previous form entries ---
  const { getOption } = useOptions() // user colors are managed through db options
  const [userColors, setUserColors] = useState([])
  const getUserColors = async () => {
    const userColors = await getOption("user_colors")
    setUserColors(userColors || [])
  }
  const availableColors = useMemo(() => {
    return [...userColors, ...defaultColors]
  }, [userColors])
  const pickAvailableColor = (value: string) => {
    onChange({
      target: {
        value
      }
    })
  }

  const {value, onChange, ...inputProps } = props

  useEffect(() => {
    getUserColors()
  }, [])

  return (
    <div role="color-picker" className="flex gap-2 flex-wrap center">
      <input
        placeholder="#123456"
        {...inputProps}
        value={value}
        onChange={onChange}
      />
      {availableColors.map(color => (
        <button
          role="color-picker-available-color"
          key={color}
          type="button"
          className="ht-btn ht-interaction w-7 h-7 rounded-full flex justify-center items-center text-white"
          style={{backgroundColor: color}}
          onClick={() => pickAvailableColor(color)}
        >
          {value === color && (
            <span role="available-color-active">
              <BookmarkIcon className="size-3"  />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
