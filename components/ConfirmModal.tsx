import { ConfirmModalRef, ModalRef } from "@/app/types"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Modal from "@/components/Modal"

const ConfirmModal = forwardRef<ConfirmModalRef>((props, ref) => {
  const confirmPromise = useRef<{ resolve: () => boolean } | undefined>(undefined)
  const modalRef = useRef<ModalRef>(null)

  const confirm = async () => {
    modalRef.current?.show()
    return new Promise((resolve) => {
      confirmPromise.current = {
        resolve,
      }
    })
  }

  function resolveConfirm(confirmed: boolean) {
    confirmPromise.current?.resolve(confirmed)
  }

  useImperativeHandle(ref, () => ({
    confirm
  }))

  return (
    <Modal ref={modalRef} title="Confirm your action" size="max-w-lg">
      <div className="grid grid-cols-1 gap-3">
        <div className="text-sm">
            Are you sure you want to proceed?
        </div>
        {confirmPromise.current && (<div className="flex justify-end">
          <button type="button" className="ht-btn ht-interaction rounded-lg bg-gray-800 shadow-lg shadow-gray-400/50 text-white py-2 px-5" onClick={() => {resolveConfirm(true)}}>
            Confirm
          </button>
        </div>)}
      </div>
    </Modal>
  )
})

export default ConfirmModal