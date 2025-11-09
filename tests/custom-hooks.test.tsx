import { act, renderHook, waitFor } from "@testing-library/react"

// --- useForm ---
import useForm from '@/hooks/useForm'
const defaultValues = {
  name: '',
  last_name: 'Rossi',
  count: 2
}
describe("useForm", () => {
  test('model init equals defaultValues', () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    expect(JSON.stringify(useFormRendered.result.current.model)).toBe(JSON.stringify(defaultValues))
  })

  test('model batch update', async () => {
    const values = { // order of properties is important
      name: 'Mario',
      count: 5
    }
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    act(() => {
      useFormRendered.result.current.init(values)
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.model.name).toBe(values.name)
      expect(useFormRendered.result.current.model.last_name).toBe(defaultValues.last_name) // last_name should be kept as defaultValue, since not included in values partial
    })
  })

  test('model update of single field', async () => {
    const useFormRendered = renderHook(() => useForm({ defaultValues }))
    act(() => {
      useFormRendered.result.current.changeField('count', 3)
    })
    await waitFor(() => {
      expect(useFormRendered.result.current.model.count).toBe(3)
    })
  })
})