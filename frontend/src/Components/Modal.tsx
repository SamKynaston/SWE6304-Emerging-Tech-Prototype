import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" onClose={onClose} className="w-full max-w-lg rounded-xl bg-stone-900 p-6 text-gray-100 shadow-xl">
      {children}
      <button type="button" onClick={onClose}>Close</button>
    </dialog>
  );
}