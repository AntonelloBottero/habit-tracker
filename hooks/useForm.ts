import { useReducer } from 'react'

// validators
type Validator = (value: unknown) => true | string
type Validators = {
    [key: string]: Validator
}
export const validators: Validators = {
  required: (value) => {
    return !!value || 'This field is required'
  }
}

// hook interfaces
export interface Model {
  [key: string]: unknown
}

export interface ModelReducerAction {
  type?: 'batch' | 'update' // batch to edit multiple fields, update to edit a single field
  key?: string
  value: Model | unknown | null
}

export interface Rules {
    [key: string]: {
        value: unknown
        validators: Validator[]
    }
}

export interface ErrorMessages {
    [key: string]: string[] | undefined
}

interface Params {
    defaultValues: Model
    resetErrorMessages?: () => void
    rules?: Rules
}

// hook
export default function useForm({ resetErrorMessages, defaultValues } : Params) {
  // model reducer
  const modelReducer = (state: Model, { type, key, value}: ModelReducerAction): Model => {
    let model = {...state}
    switch(type) {
    case 'batch':
      model = {
        ...Object.entries(defaultValues).reduce((r: Model, [k, v]: [string, unknown]) => ({
          ...r,
          [k]:  value !== null && typeof value === 'object' && (value as Model)[k] !== undefined ? (value as Model)[k] : v
        }), {})
      }
      break
    case 'update':
      if(typeof key === 'string' && defaultValues[key] !== undefined) {
        model[key] = value
      }
      break
    }
    return model
  }
  const [model, dispatchModel] = useReducer(modelReducer, defaultValues)
  // update single field and check field rules
  const changeField = (key: string, value: string): void => {
    dispatchModel({ type: 'update', key, value})
    // TODO: check rules
  }

  // init
  const init = (): void => {
    if(resetErrorMessages) { resetErrorMessages() }
  }

  return { model, changeField, init }
}

