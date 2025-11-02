import { useState, useReducer } from 'react'

// validators
type Validator = (value: unknown) => true | string
type Validators = {
    [key: string]: Validator
}
export const validators: Validators = {
  required: (value) => {
    console.log('required', value)
    return !!value || 'This field is required'
  }
}

// hook interfaces
export interface Model<T> {
  [key: string]: unknown
}

export interface ModelReducerAction {
  type?: 'batch' | 'update' // batch to edit multiple fields, update to edit a single field
  key?: string
  value: Model<never> | unknown | null
}
export interface Rules {
    [key: string]: Validator[]
}
export interface ErrorMessages {
    [key: string]: string[] | undefined
}
interface Params {
    defaultValues: Model<never>
    resetErrorMessages?: () => void
    rules?: Rules
}

// hook
export default function useForm({ resetErrorMessages, defaultValues, rules } : Params) {
  // model reducer
  const modelReducer = (state: Model<typeof defaultValues>, { type, key, value}: ModelReducerAction): Model<typeof defaultValues> => {
    switch(type) {
    case 'batch':
      return {
        ...Object.entries(defaultValues).reduce((r: Model<typeof defaultValues>, [k, v]: [string, unknown]) => ({
          ...r,
          [k]:  value !== null && typeof value === 'object' && (value as Model<typeof defaultValues>)[k] !== undefined ? (value as Model<typeof defaultValues>)[k] : v
        }), {})
      }
    case 'update':
      if(typeof key === 'string' && defaultValues[key] !== undefined) {
        return {
          ...state,
          [key]: value
        }
      }
    default:
      return {...state}
    }
  }
  const [model, dispatchModel] = useReducer(modelReducer, defaultValues)

  // error messages
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({})
  const validate = (key?: string, value?: Model<typeof defaultValues> | unknown): void => {
    const keys = !key ? Object.keys(rules || {}) : [key] // which fields we should check
    setErrorMessages({
      ...errorMessages,
      ...keys.reduce((r, key) => ({
        ...r,
        [key]: ((rules || {})[key] || [])
          .map(rule =>rule(typeof value !== 'undefined' ? value : model[key])) // we check the rule with model value or new local value that is still not in the state
          .filter(message => typeof message === 'string')
      }), {})
    })
  }

  // update single field and check field rules
  const changeField = (key: string, value: string | boolean): void => {
    dispatchModel({ type: 'update', key, value})
    validate(key, value)
  }

  // init
  const init = (): void => {
    if(resetErrorMessages) { resetErrorMessages() }
  }

  return { model, changeField, init, errorMessages }
}

