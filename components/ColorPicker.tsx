/**
 * Color picker
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */
import { defaultColors } from "@/utils/constants"

import { useEffect, ChangeEvent } from "react"
import useDb from "@/db/useDb"
import { BookmarkIcon } from '@heroicons/react/24/solid'
import { FormFieldProps } from "@/app/types"



export default function ColorPicker(props: FormFieldProps) {
  const {value, onChange, ...inputProps } = props

  // user colors are managed through db options
  const { options, getOption } = useDb()
  useEffect(() => {
    getOption("user_colors")
  }, [])

  // --- mixes default color with the ones chosen by the user in previous form entries ---
  const availableColors = [...((options.user_colors as string[] | null | undefined) || []), ...defaultColors]

  function pickAvailableColor(value: string) {
    if(!onChange) { return undefined }
    onChange({
      target: {
        value
      }
    } as ChangeEvent<HTMLInputElement>)
  }

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
