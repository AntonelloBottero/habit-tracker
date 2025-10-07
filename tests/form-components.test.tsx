import {render, screen, within} from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument() assertion
import InputWrapper from '@/components/InputWrapper'

describe('InputWrapper component', () => {
    test('Renders input prop inside input wrapper', () => {
        render(<InputWrapper input={<input type="text" />} />)
        const WrapperElement = screen.getByRole('input-wrapper')
        const WrapperContext = within(WrapperElement)
        const InputElement = WrapperContext.getByRole('input')
        expect(InputElement).toBeInTheDocument()
    })
})