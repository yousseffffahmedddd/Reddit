import { type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

const modalRoot = typeof document !== 'undefined' ? document.body : null

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
  title?: string
}>

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen || !modalRoot) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <h3 className="mb-4 text-xl font-semibold text-slate-900">{title}</h3>}
        {children}
      </div>
    </div>,
    modalRoot,
  )
}
