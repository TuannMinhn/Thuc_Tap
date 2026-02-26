import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

const PreviewFrame = ({ children }) => {
    const [width, setWidth] = useState('100%'); // '100%', '768px', '375px'

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Bar Controls */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center gap-4 sticky top-0 z-50 shadow-sm">
                <span className="text-sm font-semibold text-gray-500 mr-2">Chế độ xem:</span>

                <button
                    onClick={() => setWidth('100%')}
                    className={`p-2 rounded-lg flex items-center gap-2 transition-all ${width === '100%' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Desktop (100%)"
                >
                    <Monitor size={20} />
                    <span className="text-sm">Desktop</span>
                </button>

                <button
                    onClick={() => setWidth('768px')}
                    className={`p-2 rounded-lg flex items-center gap-2 transition-all ${width === '768px' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Tablet (768px)"
                >
                    <Tablet size={20} />
                    <span className="text-sm">Tablet</span>
                </button>

                <button
                    onClick={() => setWidth('375px')}
                    className={`p-2 rounded-lg flex items-center gap-2 transition-all ${width === '375px' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Mobile (375px)"
                >
                    <Smartphone size={20} />
                    <span className="text-sm">Mobile</span>
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-gray-200/50">
                <div
                    className="bg-white shadow-2xl transition-all duration-300 ease-in-out min-h-[calc(100vh-100px)] overflow-hidden relative"
                    style={{
                        width: width,
                        maxWidth: '100%',
                        border: width !== '100%' ? '12px solid #1a1a1a' : 'none',
                        borderRadius: width !== '100%' ? '24px' : '0',
                    }}
                >
                    {/* Content */}
                    <div className={width !== '100%' ? 'h-full overflow-y-auto max-h-[calc(100vh-124px)] custom-scrollbar' : ''}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewFrame;
