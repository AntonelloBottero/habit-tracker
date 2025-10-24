import {render, screen, within, waitFor} from '@testing-library/react'
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

import ColorPicker from '@/components/ColorPicker'
import {defaultColors} from '@/utils/constants'
let colorValue: string = ''
describe('ColorPicker component', () => {
  beforeEach(() => {
    colorValue = ''
  })

  test('Renders color buttons inside component', () => {
    render(<ColorPicker name="Color" value={colorValue} onChange={(e) => colorValue = e.target.value} />)
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
    expect(AvailableColorElements.length).toBeGreaterThan(1)
    expect(AvailableColorElements[0]).toBeInTheDocument()
  })

  test('Clicking on a default color triggers correct value update', async () => {
    render(<ColorPicker name="Color" value={colorValue} onChange={(e) => colorValue = e.target.value} />)
    const defaultColor = defaultColors[1]
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const AvailableColorElement = PickerContext.getByRole('color-picker-available-color', { value: { text: defaultColor }})
    AvailableColorElement.click()
    await waitFor(() => expect(colorValue).toHaveValue(defaultColor))
  })

  test('Clicking on a default color highlights it', async () => {
    const defaultColor = defaultColors[1]
    render(<ColorPicker name="Color" value={colorValue} onChange={(e) => colorValue = e.target.value} />)
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const AvailableColorElement = PickerContext.getByRole('color-picker-available-color', { value: { text: defaultColor }})
    const AvailableColorContext = within(AvailableColorElement)
    AvailableColorElement.click()
    await waitFor(() => expect(AvailableColorContext.findByRole('available-color-active')).toBeInTheDocument() )
  })

  test('Clicking on a default color updates input field value', async () => {
    const defaultColor = defaultColors[1]
    render(<ColorPicker name="Color" value={colorValue} onChange={(e) => colorValue = e.target.value} />)
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const AvailableColorElement = PickerContext.getByRole('color-picker-available-color', { value: { text: defaultColor }})
    AvailableColorElement.click()
    const inputElement = PickerContext.getByRole('textbox')
    await waitFor(() => expect(inputElement).toHaveValue(defaultColor))
  })
})