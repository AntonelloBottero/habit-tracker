import { cloneElement, ReactElement } from 'react'

interface Input extends ReactElement {
    props: {
        className?: string
    }
}

interface Props {
    errorMessages?: string[]
    label?: string,
    input: Input
}

export default function InputWrapper({ errorMessages = [], label = '', input}: Props) {
  return (
    <div role="input-wrapper">
      {label && <label className={'block mb-1 text-sm font-medium'+(errorMessages?.length ? 'text-red-700 dark:text-red-500' : '')}>{label}</label>}
      {cloneElement(input, {
        className: (input.props.className || '') + (errorMessages?.length ? ' bg-red-50 !outline-red-500 text-red-900 placeholder:text-red-500 !focus:outline-red-500 dark:text-red-500 dark:placeholder:text-red-500 !dark:outline-red-500' : '')
      })}
      {errorMessages.length > 0 && (
        <div role="input-wrapper-errors" className="mt-1 text-sm text-red-600 dark:text-red-500">
          {errorMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  )
}