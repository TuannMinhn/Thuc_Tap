import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, onCancel, title, message, confirmLabel = 'Xóa', cancelLabel = 'Hủy', variant = 'danger' }) => {
    useLockBodyScroll(isOpen);
    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    // Handler for Cancel/Secondary Action
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden zoom-in-95 border relative ${isDanger ? 'border-red-100' : 'border-blue-100'}`}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6 text-sm whitespace-pre-line">{message}</p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCancel}
                            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`py-2.5 px-4 text-white rounded-lg font-medium transition-colors shadow-lg ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
