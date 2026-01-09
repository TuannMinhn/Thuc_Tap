import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Steps = ({ data }) => {
    const { items = [], style = {} } = data || {};
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
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                {displayItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center group">
                        <div className={`w-24 h-24 rounded-full ${stepColor} text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform relative border-4 border-white`}>
                            {item.step || index + 1}
                        </div>
                        <h3 className={`text-xl font-bold ${textColor} mb-3`}>{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed px-4">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Steps;
