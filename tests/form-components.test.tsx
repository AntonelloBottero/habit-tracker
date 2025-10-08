import {render, screen, within} from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument() assertion
import InputWrapper from '@/components/InputWrapper'

describe('InputWrapper component', () => {
    test('Renders input prop inside input wrapper', () => {
        render(<InputWrapper input={<input type="text" />} />)
        const WrapperElement = screen.getByRole('input-wrapper')
        const WrapperContext = within(WrapperElement)
        const InputElement = WrapperContext.getByRole('textbox')
        expect(InputElement).toBeInTheDocument()
    })

    test('Renders error messages provided by props', () => {
        const errorMessages = ['Field is required']
        render(<InputWrapper input={<input type="text" />} errorMessages={errorMessages} />)
        const WrapperElement = screen.getByRole('input-wrapper')
        const WrapperContext = within(WrapperElement)
        const ErrorMessagesElement = WrapperContext.getByRole('input-wrapper-errors')
        expect(ErrorMessagesElement).toBeInTheDocument()
    })
})