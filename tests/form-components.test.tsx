import { ReactNode } from 'react'
import {render, screen, within, act, waitFor, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom' // for toBeInTheDocument() assertion
import { DbProvider } from '@/db/useDb'

// --- DbProvider mock ---
function dbProviderMock({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DbProvider>
      { children }
    </DbProvider>
  )
}

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
import CardsInput from '@/components/CardsInput'
let colorValue: string = ''
describe('ColorPicker component', () => {
  beforeEach(() => { // before each test the value gets reset
    colorValue = ''
  })

  test('Renders color buttons inside component', () => {
    let AvailableColorElements: HTMLElement[] = []
    act(() => {
      render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProviderMock })
    })
    waitFor(() => {
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
      expect(AvailableColorElements.length).toBeGreaterThan(1)
      expect(AvailableColorElements[0]).toBeInTheDocument()
    })
  })

  test('Clicking on a default color triggers correct value update', () => {
    const defaultColor = defaultColors[1]
    function setColorValue(value: string) {
      expect(value).toBe(defaultColor)
    }
    act(() => {
      render(<ColorPicker name="Color" value={colorValue} onChange={(e) => setColorValue(e.target.value)} />, { wrapper: dbProviderMock })
    })
    waitFor(() => {
      const PickerElement = screen.getByRole('color-picker')
      const PickerContext = within(PickerElement)
      const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
      const AvailableColorElement = AvailableColorElements[AvailableColorElements.length - defaultColors.length + 1]
      AvailableColorElement.click()
    })
  })

  test('If value is an available color, it gets highlighted', async () => {
    colorValue = defaultColors[1]
    act(() => {
      render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProviderMock })
    })
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const AvailableColorElements = PickerContext.getAllByRole('color-picker-available-color')
    const AvailableColorElement = AvailableColorElements[AvailableColorElements.length - defaultColors.length + 1]
    const AvailableColorContext = within(AvailableColorElement)
    const AvailableColorActiveElement = await AvailableColorContext.findByRole('available-color-active')
    waitFor(() => {
      expect(AvailableColorActiveElement).toBeInTheDocument()
    })
  })

  test('Color value in input field', () => {
    colorValue = defaultColors[1]
    act(() => {
      render(<ColorPicker name="Color" value={colorValue} onChange={() => {}} />, { wrapper: dbProviderMock })
    })
    const PickerElement = screen.getByRole('color-picker')
    const PickerContext = within(PickerElement)
    const InputElement = PickerContext.getByDisplayValue(defaultColors[1])
    expect(InputElement).toBeInTheDocument()
  })
})

// --- CardsInput ---
const cardsInputItems = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3'}
]

describe('CardsInput', () => {
  test('Display items', async () => {
    await act(() => {
      render(<CardsInput value="" items={cardsInputItems} />)
    })

    const CardsInputElement = screen.getByRole('cards-input')
    const CardsInputContext = within(CardsInputElement)
    const CardsInputItems = CardsInputContext.getAllByRole('cards-input-item')
    await waitFor(() => {
      expect(CardsInputItems.length).toBe(3)
    })

    const CardsInputItemContext = within(CardsInputItems[1])
    const CardsInputItemLabel = CardsInputItemContext.findByLabelText(cardsInputItems[1].name)
    await waitFor(() => {
      expect(CardsInputItemLabel).toBeDefined()
    })
  })

  test('Override content', async () => {
    await act(() => {
      render(<CardsInput value="" items={cardsInputItems} content={(item) => <h1>{item.name}</h1>} />)
    })

    const CardsInputElement = screen.getByRole('cards-input')
    const CardsInputContext = within(CardsInputElement)
    const CardsInputItems = CardsInputContext.getAllByRole('cards-input-item')
    await waitFor(() => {
      expect(CardsInputItems.length).toBe(3)
    })

    const CardsInputItemContext = within(CardsInputItems[1])
    const CardsInputItemH1 = CardsInputItemContext.getByRole('heading', {level: 1})
    const CardsInputItemLabel = CardsInputItemContext.findByLabelText(cardsInputItems[1].name)
    await waitFor(() => {
      expect(CardsInputItemH1).toBeDefined()
      expect(CardsInputItemLabel).toBeDefined()
    })
  })

  test('Value highlights item', async () => {
    await act(() => {
      render(<CardsInput value={2} items={cardsInputItems} />)
    })
    const CardsInputElement = screen.getByRole('cards-input')
    const CardsInputContext = within(CardsInputElement)
    const CardsInputItems = CardsInputContext.getAllByRole('cards-input-item')
    await waitFor(() => {
      expect(CardsInputItems.length).toBe(3)
      expect(CardsInputItems[1]).toHaveClass('bg-green-50')
      expect(CardsInputItems[1]).toHaveClass('outline-green-200')
    })
  })

  test('Value changes after item click', async () => {
    function setValue(value: string) {
      expect(value).toBe(cardsInputItems[1].id)
    }
    await act(() => {
      render(<CardsInput value={1} items={cardsInputItems} onChange={(e) => setValue(e.target.value)} />)
    })
    const CardsInputElement = screen.getByRole('cards-input')
    const CardsInputContext = within(CardsInputElement)
    const CardsInputItems = CardsInputContext.getAllByRole('cards-input-item')
    await waitFor(() => {
      expect(CardsInputItems.length).toBe(3)
    })

    fireEvent(
      CardsInputItems[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  })
})