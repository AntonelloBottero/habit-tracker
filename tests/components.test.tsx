import { ConfirmModalRef } from '@/app/types'
import ConfirmModal from '@/components/ConfirmModal'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { act, useRef, useEffect } from 'react'

const TestConfirmModalConsumer = ({ onComponentReady, ...props }: { onComponentReady: (values: ConfirmModalRef) => void}) => {
  const confirmModalRef = useRef(null)
  useEffect(() => {
    if(confirmModalRef.current) {
      onComponentReady(confirmModalRef.current as ConfirmModalRef)
    }
  }, [confirmModalRef])

  return <ConfirmModal ref={confirmModalRef} {...props} />
}

describe('ConfirmDialog', () => {
  test('Modal visibility', async () => {
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    act(() => {
      (confirmModalRef as ConfirmModalRef).confirm()
      const ModalElement = screen.getByRole('confirm-modal')
      expect(ModalElement).toBeVisible()
    })
  })

  test('confirm', async () => {
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    act(() => {
      (confirmModalRef as ConfirmModalRef).confirm().then((confirmed: boolean) => {
        expect(confirmed).toBe(true)
      })
      const ModalElement = screen.getByRole('confirm-modal')
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
    const confirmModalRef = useRef<ConfirmModalRef | undefined>(undefined)
    render(<ConfirmModal ref={confirmModalRef} />)

    await act(() => {
      expect(confirmModalRef.current).toBeDefined()
    })

    act(() => {
      (confirmModalRef.current as ConfirmModalRef).confirm().then((confirmed: boolean) => {
        expect(confirmed).toBe(false)
      })
      const ModalElement = screen.getByRole('confirm-modal')
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

  test('customization', () => {
    const title = 'Custom confirm title'
    const text = 'Custom confirm text'
    const confirmActionText = 'Custom confirm action'
    render(<ConfirmModal title={title} text={text} confirmActionText={confirmActionText} />)

    act(() => {
      const ModalElement = screen.getByRole('confirm-modal')
      const ModalContext = within(ModalElement)
      const TitleElement = ModalContext.getByText(title)
      expect(TitleElement).toBeDefined()
      const TextElement = ModalContext.getByText(text)
      expect(TextElement).toBeDefined()
      const ConfirmActionElement = ModalContext.getByText(confirmActionText)
      expect(ConfirmActionElement).toBeDefined()
    })
  })
})