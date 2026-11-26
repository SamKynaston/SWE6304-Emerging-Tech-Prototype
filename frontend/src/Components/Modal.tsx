import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
    open: boolean;
    text: string;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmationModal({ text, title, open, onClose, onConfirm }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" onClose={onClose} className="fixed inset-0 m-auto w-full max-w-lg rounded-xl bg-stone-900 p-6 text-gray-100 shadow-xl">
      <span className="flex flex-col gap-4">
        <h1>{title}</h1>
        <p className="text-gray-200">{text}</p>
        <span className="flex gap-3">
          <button type="button" className="cancel" onClick={onClose}>Close</button>
          <button type="button" className="confirmation" onClick={onConfirm}>Confirm</button>
        </span>
      </span>
    </dialog>
  );
}