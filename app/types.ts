export interface ModalRef {
    show: () => void
}

export interface FakeInputChangeEvent { // simulates a regular form input change event
    target: {
        value: boolean
    }
}