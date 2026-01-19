import React from 'react';

const Timeline = ({ data }) => {
    const { items = [], style = {} } = data || {};
    const {
        lineColor = 'bg-blue-200',
        dotColor = 'bg-blue-600',
        textColor = 'text-gray-800',
        dateColor = 'text-blue-600'
    } = style;

    // Default items if empty (for preview)
    const displayItems = items.length > 0 ? items : [
        { date: '2024', title: 'Milestone 1', description: 'Description of the event.' },
        { date: '2025', title: 'Milestone 2', description: 'Future plans and goals.' }
    ];

    return (
        <div className="relative py-8">
            {/* Vertical Line */}
            <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 ${lineColor} -translate-x-1/2`}></div>

            <div className="space-y-12">
                {displayItems.map((item, index) => {
                    const badge = item.year || item.step || item.phase || item.date;
                    const title = item.title || item.action || item.phase;
                    const desc = item.description || item.goal || item.status;

                    return (
                        <div key={index} className={`relative flex items-center justify-between md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Dot */}
                            <div className={`absolute left-4 md:left-1/2 w-4 h-4 ${dotColor} rounded-full -translate-x-1/2 border-4 border-white shadow`}></div>

                            {/* Content Width Spacer (Empty on one side) */}
                            <div className="hidden md:block w-5/12"></div>

                            {/* Content Box */}
                            <div className={`w-[calc(100%-3rem)] md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    {badge && (
                                        <span className={`inline-block px-3 py-1 rounded-full bg-blue-50 text-xs font-bold ${dateColor} mb-2`}>
                                            {badge}
                                        </span>
                                    )}
                                    <h3 className={`text-lg font-bold ${textColor} mb-2`}>{title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;
