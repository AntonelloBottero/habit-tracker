import { ConfirmModalRef } from '@/app/types'
import ConfirmModal from '@/components/ConfirmModal'
import { fireEvent, render, screen, waitFor, within, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRef, useEffect } from 'react'

function TestConfirmModalConsumer({ onComponentReady, ...props }: { onComponentReady: (values: ConfirmModalRef) => void}) {
  const confirmModalRef = useRef(null)
  useEffect(() => {
    if(confirmModalRef.current) {
      onComponentReady(confirmModalRef.current as ConfirmModalRef)
    }
  }, [confirmModalRef])

  return <ConfirmModal ref={confirmModalRef} {...props} />
}

describe('ConfirmDialog', () => {
  async function init(props = {}): Promise<[ConfirmModalRef, HTMLElement]> {
    let confirmModalRef!: ConfirmModalRef
    act(() => {
      render(<TestConfirmModalConsumer {...props} onComponentReady={(values) => { confirmModalRef = values }} />)
    })
    await waitFor(() => {
      expect(confirmModalRef).toBeDefined()
    })

    const ModalElement = screen.getByRole('confirm-modal', { hidden: true })
    await waitFor(() => {
      expect(ModalElement).toBeDefined()
    })
    return [confirmModalRef, ModalElement]
  }

  test('Modal visibility', async () => {
    const [confirmModalRef, ModalElement] = await init()

    act(() => {
      (confirmModalRef as ConfirmModalRef).confirm()
    })

    waitFor(() => {
      expect(ModalElement).toBeVisible()
    })
  })

  test('confirm', async () => {
    const [confirmModalRef, ModalElement] = await init()

    await act(() => {
      (confirmModalRef as ConfirmModalRef).confirm().then((confirmed) => {
        expect(confirmed).toBe(true)
      })
      expect(ModalElement).toBeVisible()
    })

    await waitFor(async () => {
      const ModalContext = within(ModalElement)
      const ConfirmBtnElement = ModalContext.getByText('Confirm')
      expect(ConfirmBtnElement).toBeDefined()
      fireEvent(
        ConfirmBtnElement,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })
  })

  test('cancel', async () => {
    const [confirmModalRef, ModalElement] = await init()

    await act(() => {
      (confirmModalRef as ConfirmModalRef).confirm().then((confirmed) => {
        expect(confirmed).toBe(false)
      })
      expect(ModalElement).toBeVisible()
    })

    await waitFor(async () => {
      const ModalContext = within(ModalElement)
      const CancelBtnElement = ModalContext.getByText('Cancel')
      expect(CancelBtnElement).toBeDefined()
      fireEvent(
        CancelBtnElement,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })
  })

  test('customization', async () => {
    const props = {
      title: 'Custom confirm title',
      text: 'Custom confirm text',
      confirmActionText: 'Custom confirm action'
    }
    const [confirmModalRef, ModalElement] = await init(props)

    await act(() => {
      (confirmModalRef as ConfirmModalRef).confirm()
    })

    await waitFor(() => {
      const ModalContext = within(ModalElement)
      const TitleElement = ModalContext.getByText(props.title)
      expect(TitleElement).toBeDefined()
      const TextElement = ModalContext.getByText(props.text)
      expect(TextElement).toBeDefined()
      const ConfirmActionElement = ModalContext.getByText(props.confirmActionText)
      expect(ConfirmActionElement).toBeDefined()
    })
  })
})