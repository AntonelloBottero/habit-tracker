/**
 * Color picker
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */

import { ChangeEvent } from "react"
import { CircleFilled } from "@project-lary/react-material-symbols-700-rounded"
import { FormFieldProps } from "@/app/types"
import useOptions from "@/src/shared/adapters/useOptions"



export default function({value, onChange, ...inputProps }: FormFieldProps) {

  // user colors are managed through db options
  const { colors } = useOptions()

  function pickAvailableColor(value: string) {
    if(!onChange) { return undefined }
    onChange({
      target: {
        value
      }
    } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div role="color-picker" className="flex gap-2 center">
      <div className="max-w-[100px]">
        <input
          placeholder="#123456"
          {...inputProps}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {colors.map(color => (
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
                <CircleFilled className="size-3"  />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}