import { ConfirmModalRef } from "@/app/types"
import { forwardRef, useImperativeHandle } from "react"

const ConfirmModal = forwardRef<ConfirmModalRef>((props, ref) => {
  const confirm = async () => {
    return true
  }

  useImperativeHandle(ref, () => ({
    confirm
  }))
})

export default ConfirmModal