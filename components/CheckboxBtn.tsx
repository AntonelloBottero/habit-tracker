import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { FormFieldProps } from "@/app/types"

interface Props extends FormFieldProps {
  defaultChecked: boolean
}

export default function CheckboxBtn(props: Props) {
  return (
    <button
      type="button"
      className="ht-btn ht-interaction w-9 h-9"
    >
      <CheckCircleIcon />
    </button>
  )
}