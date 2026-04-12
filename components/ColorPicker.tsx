/**
 * Color picker
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */
import { defaultColors } from "@/utils/constants"

import { ChangeEvent, forwardRef, useImperativeHandle } from "react"
import useDb from "@/db/useDb"
import { BookmarkIcon } from '@heroicons/react/24/solid'
import { ColorPickerRef, FormFieldProps } from "@/app/types"



const ColorPicker = forwardRef<ColorPickerRef, FormFieldProps>((props: FormFieldProps, ref) => {
  const {value, onChange, ...inputProps } = props

  // customizes the ref object the parent can access
  useImperativeHandle(ref, () => ({
    updateUserColorsOption,
  }))

  // user colors are managed through db options
  const { options, createOption, getOption } = useDb()

  // --- mixes default color with the ones chosen by the user in previous form entries ---
  const availableColors = [...((options.current.user_colors as string[] | null | undefined) || []), ...defaultColors]

  function pickAvailableColor(value: string) {
    if(!onChange) { return undefined }
    onChange({
      target: {
        value
      }
    } as ChangeEvent<HTMLInputElement>)
  }

  async function updateUserColorsOption(color: string): Promise<void> {
    if(availableColors.includes(color)) { return undefined }
    await createOption('user_colors', [...((options.current.user_colors as string[] | null | undefined) || []), color])
    await getOption('user_colors', true)
  }

  return (
    <div role="color-picker" className="flex gap-2 center">
      <div>
        <input
          placeholder="#123456"
          {...inputProps}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-wrap gap-1">
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
    </div>
  )
})

export default ColorPicker