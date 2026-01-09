import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Edit2, Eye, Save, Download } from 'lucide-react';

const EditorToolbar = () => {
    const { isEditing, setIsEditing, config } = useBuilder();

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "landing_page_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {isEditing && (
                <button
                    onClick={handleExport}
                    className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all flex items-center justify-center tooltip-container"
                    title="Export JSON"
                >
                    <Download size={24} />
                </button>
            )}

            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`${isEditing ? 'bg-blue-600' : 'bg-gray-800'} text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center`}
                title={isEditing ? "Preview Mode" : "Edit Mode"}
            >
                {isEditing ? <Eye size={24} /> : <Edit2 size={24} />}
            </button>
        </div>
    );
};

export default EditorToolbar;
