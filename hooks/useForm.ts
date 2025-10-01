type Values = object | null | undefined
export type String = string | null | undefined
export interface ErrorMessages {
    [key: string]: any
}

interface Params {
    initFormModel: (a: Values) => void
    resetErrorMessages?: () => void
}
export default function useForm({ initFormModel, resetErrorMessages } : Params) {
    const init = (values: any): void => {
        initFormModel(values)
        if(resetErrorMessages) { resetErrorMessages() }
    }

    return { init }
}

type Validators = {
    [key: string]: (value: any) => true | string
}
export const validators: Validators = {
    required: (value) => {
        return !!value || 'This field is required'
    }
}