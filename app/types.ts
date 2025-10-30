import { ChangeEvent } from "react"

export interface ModalRef {
    show: () => void
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
    value: string
    placeholder?: string
    className?: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}