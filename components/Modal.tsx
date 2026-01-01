import { useState, ReactElement, forwardRef, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom' // we want the modal to be appended at the end of the document, in order to avoid relative and overflow hidden containers
import { ModalRef } from '@/app/types'

// Portal -> Container at the end of the document into which we will append the modal
const modalRoot = typeof document !== 'undefined'
  ? document.querySelector('[data-ht-role="modals"]')
  : null

interface Props {
    title?: string,
    children?: ReactElement | ReactElement[],
    size?: string
    role?: string
}

const Modal = forwardRef<ModalRef>(({ title, children, size = 'max-w-xl', role = 'modal' }: Props, ref) => {
  const [value, setValue] = useState(false)
  const show = () => {
    setValue(true)
  }
  const hide = () => {
    setValue(false)
  }
  // customizes the ref object the parent can access
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))

  const modal = (
    <div role={role} tabIndex={-1} aria-hidden="true" className={(!value ? 'hidden ' : 'flex') + ' overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/25'}>
      <div className={`relative p-4 w-full ${size} max-h-full`}>
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
            {title && (<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>)}
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setValue(false)}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="px-4 pb-4 md:px-5 md:pb-5 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  return modalRoot ? createPortal( modal, modalRoot) : modal
})

export default Modal