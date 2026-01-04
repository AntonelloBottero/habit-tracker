/**
 * Color picker
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */
import { defaultColors } from "@/utils/constants"

import { useState, useEffect, useMemo, ChangeEvent } from "react"
import useDb from "@/db/useDb"
import { BookmarkIcon } from '@heroicons/react/24/solid'
import { FormFieldProps } from "@/app/types"



export default function ColorPicker(props: FormFieldProps) {
  // --- mixes default color with the ones chosen by the user in previous form entries ---
  const { getOption } = useDb() // user colors are managed through db options
  const [userColors, setUserColors] = useState<string[]>([])
  async function getUserColors() {
    const userColors = await getOption("user_colors") as string[] | undefined
    setUserColors(userColors || [])
  }
  const availableColors = useMemo(() => {
    return [...userColors, ...defaultColors]
  }, [userColors])
  function pickAvailableColor(value: string) {
    onChange({
      target: {
        value
      }
    } as ChangeEvent<HTMLInputElement>)
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
