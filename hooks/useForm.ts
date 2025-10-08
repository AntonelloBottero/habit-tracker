type Validator = (value: unknown) => true | string
type Validators = {
    [key: string]: Validator
}
export const validators: Validators = {
  required: (value) => {
    return !!value || 'This field is required'
  }
}

export type String = string | null | undefined
export interface ErrorMessages {
    [key: string]: string[] | undefined
}

export interface Rules {
    [key: string]: {
        value: unknown
        validators: Validator[]
    }
}

interface Params {
    resetErrorMessages?: () => void
    rules?: Rules
}
export default function useForm({ resetErrorMessages, rules } : Params) {
  const init = (): void => {
    if(resetErrorMessages) { resetErrorMessages() }
  }

  return { init }
}

