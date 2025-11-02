import { useState, useReducer } from 'react'

// validators
type Validator = (value: unknown) => true | string
type Validators = {
    [key: string]: Validator
}
export const validators: Validators = {
  required: (value) => {
    return !!value || 'This field is required'
  },
  numeric: (value) => {
    const n = Number(value)
    return !value || !isNaN(n) || 'Insert a numeric value'
  }
}

// hook interfaces

export interface ModelReducerAction<T extends object> {
  type?: 'batch' | 'update' // batch to edit multiple fields, update to edit a single field
  key?: string
  value: T | unknown | null
}
export interface Rules {
    [key: string]: Validator[]
}
export interface ErrorMessages {
    [key: string]: string[] | undefined
}
interface Params<T extends object> {
    defaultValues: T
    resetErrorMessages?: () => void
    rules?: Rules
}

// hook
export default function useForm<T extends object>({ resetErrorMessages, defaultValues, rules } : Params<T>) {
  // model reducer
  const modelReducer = (state: T, { type, key, value }: ModelReducerAction<T>): T => {
    switch(type) {
    case 'batch':
      const batchValue = value as T
      return {
        ...Object.entries(defaultValues).reduce((r, [k, v]) => ({
          ...r,
          [k]:  batchValue !== null && typeof batchValue === 'object' && (batchValue as never)[k] !== undefined ? (batchValue as never)[k] : v
        }), {} as T)
      }
    case 'update':
      if(typeof key === 'string' && (defaultValues as never)[key] !== undefined) {
        return {
          ...state,
          [key]: value
        }
      }
    default:
      return state
    }
  }
  const [model, dispatchModel] = useReducer(modelReducer, defaultValues)

  // error messages
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
  const validate = (key?: string, value?: typeof defaultValues | unknown): void => {
    const keys = !key ? Object.keys(rules || {}) : [key] // which fields we should check
    setErrorMessages({
      ...errorMessages,
      ...keys.reduce((r, key) => ({
        ...r,
        [key]: ((rules || {})[key] || [])
          .map(rule =>rule(typeof value !== 'undefined' ? value : (model as never)[key])) // we check the rule with model value or new local value that is still not in the state
          .filter(message => typeof message === 'string')
      }), {})
    })
  }

  // update single field and check field rules
  const changeField = (key: string, value: string | number | boolean): void => {
    dispatchModel({ type: 'update', key, value})
    validate(key, value)
  }

  // init
  const init = (): void => {
    if(resetErrorMessages) { resetErrorMessages() }
  }

  return { model, changeField, init, errorMessages }
}

