import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Edit2, Eye, Save, Download, ExternalLink } from 'lucide-react';

const EditorToolbar = () => {
    const { isEditing, setIsEditing, config } = useBuilder();

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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            <button
                onClick={() => window.open('/preview', '_blank')}
                className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center tooltip-container"
                title="Xem trang thực tế (New Tab)"
            >
                <ExternalLink size={24} />
            </button>
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
