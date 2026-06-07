import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Delete expense?', message = 'This action cannot be undone.' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-clay-pale flex items-center justify-center mx-auto">
          <AlertTriangle size={22} className="text-clay" />
        </div>
        <div>
          <h3 className="font-display text-lg text-ink mb-1">{title}</h3>
          <p className="text-sm text-ink/50">{message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-danger flex-1 justify-center" onClick={() => { onConfirm(); onClose(); }}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
