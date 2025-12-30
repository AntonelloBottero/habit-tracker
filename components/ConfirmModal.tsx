import { ConfirmModalRef } from "@/app/types"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Modal from "@/components/Modal"

const ConfirmModal = forwardRef<ConfirmModalRef>((props, ref) => {
  const confirmPromise = useRef<{ resolve: () => boolean } | undefined>(undefined)
  const modalRef = useRef(null)

  const confirm = async () => {
    return new Promise((resolve) => {
      confirmPromise.current = {
        resolve,
      }
    })
  }

  useImperativeHandle(ref, () => ({
    confirm
  }))

  return (
    <Modal ref={modalRef} title="Confirm your action">
      <div className="grid grid-cols-1 gap-3">
        <div className="text-sm">
            Are you sure you want to proceed?
        </div>
        {confirmPromise.current && (<div className="flex justify-end">
          <button type="button" className="ht-btn ht-interaction" onClick={() => {confirmPromise.current?.resolve(true)}}>
            Confirm
          </button>
        </div>)}
      </div>
    </Modal>
  )
})

export default ConfirmModal