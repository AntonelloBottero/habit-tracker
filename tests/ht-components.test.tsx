import { ConfirmModalRef } from '@/app/types'
import ConfirmModal from '@/components/ConfirmModal'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom'
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
  /* test('Modal visibility', async () => {
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    act(() => {
      (confirmModalRef as ConfirmModalRef).confirm()
      const ModalElement = screen.getByRole('confirm-modal', { hidden: true })
      expect(ModalElement).toBeVisible()
    })
  })

  test('confirm', async () => {
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    await act(async () => {
      const confirmed = await (confirmModalRef as ConfirmModalRef).confirm()
      expect(confirmed).toBe(true)
      const ModalElement = screen.getByRole('confirm-modal', { hidden: true })
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
  }) */

  test('cancel', async () => {
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    await act(async () => {
      const confirmed = (confirmModalRef as ConfirmModalRef).confirm()
      const ModalElement = screen.getByRole('confirm-modal', { hidden: true })
      const ModalContext = within(ModalElement)
      const CancelBtnElement = ModalContext.getByText('Cancel')
      console.log('CancelBtnElement', CancelBtnElement)
      expect(CancelBtnElement).toBeDefined()
      fireEvent(
        CancelBtnElement,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
      expect(confirmed).toBe(false)
    })
  })

  /* test('customization', async () => {
    const title = 'Custom confirm title'
    const text = 'Custom confirm text'
    const confirmActionText = 'Custom confirm action'
    let confirmModalRef: ConfirmModalRef
    render(<TestConfirmModalConsumer onComponentReady={(values) => { confirmModalRef = values}} title={title} text={text} confirmActionText={confirmActionText} />)

    await act(() => {
      expect(confirmModalRef).toBeDefined()
    })

    act(() => {
      const ModalElement = screen.getByRole('confirm-modal', { hidden: true })
      const ModalContext = within(ModalElement)
      const TitleElement = ModalContext.getByText(title)
      expect(TitleElement).toBeDefined()
      const TextElement = ModalContext.getByText(text)
      expect(TextElement).toBeDefined()
      const ConfirmActionElement = ModalContext.getByText(confirmActionText)
      expect(ConfirmActionElement).toBeDefined()
    })
  }) */
})