import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Steps = ({ data }) => {
    const { items = [], style = {}, backgroundColor } = data || {};
    const {
        stepColor = 'bg-blue-600',
        textColor = 'text-gray-800'
    } = style;

    // Default items
    const displayItems = items.length > 0 ? items : [
        { step: '01', title: 'Step 1', description: 'Description 1' },
        { step: '02', title: 'Step 2', description: 'Description 2' },
        { step: '03', title: 'Step 3', description: 'Description 3' },
    ];

    return (
        <div
            className={`max-w-7xl mx-auto px-4 py-8 ${backgroundColor ? 'rounded-xl' : ''}`}
            style={{ backgroundColor }}
        >
            <div className={`grid grid-cols-1 md:grid-cols-${displayItems.length} gap-8 relative items-start`}>

                {/* Connecting Line (Desktop) - Enhanced */}
                <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200 -z-10 rounded-full"></div>

                {displayItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center group cursor-default">
                        {/* Step Circle */}
                        <div className="relative mb-6">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full" />

                            {/* Circle Content */}
                            <div className={`
                                w-24 h-24 rounded-full 
                                bg-gradient-to-br from-blue-500 to-indigo-600 
                                text-white flex items-center justify-center text-3xl font-bold 
                                shadow-lg shadow-blue-500/30
                                border-4 border-white ring-1 ring-gray-100
                                group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 
                                transition-all duration-300 ease-out z-10 relative
                            `}>
                                {item.step || index + 1}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-xs transition-transform duration-300 group-hover:translate-y-1">
                            <h3 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-3 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all`}>
                                {item.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base font-medium">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(Steps);
