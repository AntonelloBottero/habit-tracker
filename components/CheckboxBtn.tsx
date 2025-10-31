import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { FormFieldProps } from "@/app/types"

interface Props extends FormFieldProps {
  defaultChecked: boolean
}

export default function CheckboxBtn(props: Props) {
  return (
    <button
      type="button"
      className={`${props.className || ''} ht-btn ht-interaction rounded-lg outline-1 outline-gray-300 w-8 h-8`}
    >
      <CheckCircleIcon className="size-6 text-gray-300" />
    </button>
  )
}