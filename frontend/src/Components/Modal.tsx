import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
    open: boolean;
    text: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmationModal({ text, open, onClose, onConfirm }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" onClose={onClose} className="fixed inset-0 m-auto w-full max-w-lg rounded-xl bg-stone-900 p-6 text-gray-100 shadow-xl">
      <p>{text}</p>
      <span className="flex gap-3">
        <button type="button" onClick={onClose}>Close</button>
        <button type="button" onClick={onConfirm}>Confirm</button>
      </span>
    </dialog>
  );
}