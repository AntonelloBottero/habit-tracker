import { ChangeEvent } from "react"

export interface ModalRef {
    show: () => void
    hide: () => void
}

export interface ConfirmModalRef {
    confirm: () => Promise<boolean>
}

export interface FakeInputChangeEvent { // simulates a regular form input change event
    target: {
        value?: boolean
        checked?: boolean
    }
}

export interface FormFieldProps {
    id?: string
    name: string
    value?: string
    defaultChecked? : boolean
    placeholder?: string
    className?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}