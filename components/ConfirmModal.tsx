import { ConfirmModalRef, ModalRef } from "@/app/types"
import { forwardRef, useImperativeHandle, useRef } from "react"
import Modal from "@/components/Modal"

interface Props {
  title?: string
  text?: string
  confirmActionText?: string
}

interface ConfirmPromise {
  resolve: (value: boolean) => unknown
  reject: (value: boolean) => unknown
}

const ConfirmModal = forwardRef<ConfirmModalRef, Props>(({
  title = 'Confirm your action',
  text = 'Are you sure you want to proceed?',
  confirmActionText = 'Confirm'
}: Props, ref) => {
  const confirmPromise = useRef<ConfirmPromise | undefined>(undefined)
  const modalRef = useRef<ModalRef>(null)

  const confirm = async () => {
    modalRef.current?.show()
    return new Promise((resolve, reject) => {
      confirmPromise.current = {
        resolve,
        reject
      }
    })
  }

  function resolveConfirm(confirmed: boolean) {
    confirmPromise.current?.resolve(confirmed)
    modalRef.current?.hide()
  }

  useImperativeHandle(ref, () => ({
    confirm
  }))

  return (
    <Modal ref={modalRef} title={title} size="max-w-lg" role="confirm-modal">
      <div className="grid grid-cols-1 gap-3">
        <div className="text-sm">
          {text}
        </div>
        <div className="flex justify-end">
          <button type="button" className="ht-btn ht-interaction rounded-lg bg-gray-100 py-2 px-5" onClick={() => {resolveConfirm(false)}}>
            Cancel
          </button>
          <button type="button" className="ht-btn ht-interaction rounded-lg bg-gray-800 shadow-lg shadow-gray-400/50 text-white py-2 px-5" onClick={() => {resolveConfirm(true)}}>
            {confirmActionText}
          </button>
        </div>
      </div>
    </Modal>
  )
})

export default ConfirmModal