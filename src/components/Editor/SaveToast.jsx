import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useBuilder } from '../../context/BuilderContext';

const SaveToast = () => {
    const { saveStatus, isEditing } = useBuilder();

    // Only show in editing mode
    if (!isEditing || !saveStatus) return null;

    return (
        <div className={`
            fixed bottom-24 right-6 z-50 
            flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg
            transition-all duration-300 transform
            ${saveStatus === 'saved'
                ? 'bg-green-500 text-white translate-y-0 opacity-100'
                : 'bg-blue-500 text-white translate-y-0 opacity-100'}
            animate-in slide-in-from-bottom-4 fade-in
        `}>
            {saveStatus === 'saving' ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm font-medium">Đang lưu...</span>
                </>
            ) : (
                <>
                    <Check size={18} />
                    <span className="text-sm font-medium">Đã lưu!</span>
                </>
            )}
        </div>
    );
};

export default SaveToast;
