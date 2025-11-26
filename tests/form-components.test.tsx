import { ReactNode } from 'react'
import {render, screen, within, act} from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument() assertion
import { DbProvider } from '@/db/useDb'

// --- OptionsProvider mock ---
const dbProvideMock = ({ children }: Readonly<{ children: ReactNode }>) => (
  <DbProvider>
    { children }
  </DbProvider>
)

// --- InputWrapper ---
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
    act(() => {
      const WrapperElement = screen.getByRole('input-wrapper')
      const WrapperContext = within(WrapperElement)
      const ErrorMessagesElement = WrapperContext.getByRole('input-wrapper-errors')
      expect(ErrorMessagesElement).toBeInTheDocument()
    })
  })
})

// --- ColorPicker ---
import ColorPicker from '@/components/ColorPicker'
import {defaultColors} from '@/utils/constants'
let colorValue: string = ''
describe('ColorPicker component', () => {
  beforeEach(() => { // before each test the value gets reset
    colorValue = ''
  })

  test('Renders color buttons inside component', () => {
    render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProvideMock })
    act(() => {
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
      expect(AvailableColorElements.length).toBeGreaterThan(1)
      expect(AvailableColorElements[0]).toBeInTheDocument()
    })
  })

  test('Clicking on a default color triggers correct value update', async () => {
    const defaultColor = defaultColors[1]
    render(<ColorPicker name="Color" value={colorValue} onChange={(e) => setColorValue(e.target.value)} />, { wrapper: dbProvideMock })
    act(() => { // to manage internal component state change
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
      const AvailableColorElement = AvailableColorElements[AvailableColorElements.length - defaultColors.length + 1]
      AvailableColorElement.click()
    })
    function setColorValue(value: string) {
      expect(value).toBe(defaultColor)
    }
  })

  test('If value is an available color, it gets highlighted', async () => {
    colorValue = defaultColors[1]
    render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProvideMock })
    await act(async () => {
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
      const AvailableColorElement = AvailableColorElements[AvailableColorElements.length - defaultColors.length + 1]
      const AvailableColorContext = within(AvailableColorElement)
      const AvailableColorActiveElement = await AvailableColorContext.findByRole('available-color-active')
      expect(AvailableColorActiveElement).toBeInTheDocument()
    })
  })

  test('Color value in input field', () => {
    colorValue = defaultColors[1]
    render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProvideMock })
    act(() => {
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      const InputElement = PickerContext.getByDisplayValue(defaultColors[1])
      expect(InputElement).toBeInTheDocument()
    })
  })
})