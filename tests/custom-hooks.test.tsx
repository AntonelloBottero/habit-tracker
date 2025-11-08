import { act, renderHook } from "@testing-library/react"

// --- useForm ---
import useForm from '@/hooks/useForm'
describe("useForm", () => {
  test('model init', () => {
    const defaultValues = {
      name: '',
      count: 2
    }
    const { model } = renderHook(() => useForm({ defaultValues }))
    expect(JSON.stringify(model)).toBe(JSON.stringify(defaultValues))
  })
})