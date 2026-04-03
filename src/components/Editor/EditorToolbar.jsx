import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Edit2, Eye, Save, Download, ExternalLink, RotateCcw, RotateCw } from 'lucide-react';

const EditorToolbar = () => {
    const { isEditing, setIsEditing, config, actions, history } = useBuilder();

    const handleExport = () => {
        const fileContent = `export const landingPageConfig = ${JSON.stringify(config, null, 4)};`;
        const dataStr = "data:text/javascript;charset=utf-8," + encodeURIComponent(fileContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "landingPageConfig.js");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:bottom-6 md:right-6 max-md:bottom-4 max-md:right-4">
            {/* Toggle Edit/View Mode */}
            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`${isEditing ? 'bg-blue-600' : 'bg-gray-800'} text-white p-4 rounded-full shadow-lg hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center max-md:p-3`}
                title={isEditing ? "Chế độ xem" : "Chế độ chỉnh sửa"}
                aria-label={isEditing ? "Chế độ xem trước" : "Chế độ chỉnh sửa"}
            >
                {isEditing ? <Eye size={24} className="max-md:w-5 max-md:h-5" /> : <Edit2 size={24} className="max-md:w-5 max-md:h-5" />}
            </button>
        </div>
    );
};

export default EditorToolbar;
