import { useEffect, useRef } from 'react'

// ネイティブの <dialog> を使った確認ダイアログ
export function Dialog({ open, onClose, title, children, actions }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="dialog"
      onClose={onClose}
      onClick={(event) => {
        // 背景をクリックしたら閉じる
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="dialog-body">
        <h2>{title}</h2>
        {children}
        <div className="dialog-actions">{actions}</div>
      </div>
    </dialog>
  )
}
