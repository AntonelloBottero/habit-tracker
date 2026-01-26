/**
 * CheckboxBtn
 * @component
 * @props {HTMLInputElement} // handle the component like any other input element
 * @returns {TSX.Element}
 */
import { ChangeEvent, useMemo } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import type { FormFieldProps } from "@/app/types"

interface Props extends FormFieldProps {
  defaultChecked: boolean
}

export default function CheckboxBtn(props: Props) {
  // --- button className ---
  const { className, defaultChecked, onChange } = props
  const btnClassName = useMemo(() => {
    const checkedStateClassName = defaultChecked ? 'bg-primary shadow-ht' : 'outline-1 outline-gray-300'
    return `ht-btn ht-interaction rounded-lg  w-8 h-8 ${className} ${checkedStateClassName}`
  }, [className, defaultChecked])

  // --- Icon className ---
  const iconClassName = useMemo(() => {
    return `size-6 ${defaultChecked ? 'text-black-400' : 'text-gray-300'}`
  }, [defaultChecked])

  // --- onClick - toggle defaultChecked ---
  function handleOnClick() {
    onChange({
      target: {
        checked: !defaultChecked
      }
    } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={handleOnClick}
    >
      <CheckCircleIcon className={iconClassName} />
    </button>
  )
}