import React from 'react';
import { Calendar } from 'lucide-react';

const Timeline = ({ data }) => {
    const { items = [], style = {}, backgroundColor } = data || {};
    const {
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
        <div
            className={`relative py-12 px-4 md:px-0 ${backgroundColor ? 'rounded-xl' : ''}`}
            style={{ backgroundColor }}
        >
            {/* Vertical Line with Gradient */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-blue-400 -translate-x-1/2 rounded-full opacity-30"></div>

            <div className="space-y-12 max-w-6xl mx-auto">
                {displayItems.map((item, index) => {
                    const badge = item.year || item.step || item.phase || item.date;
                    const title = item.title || item.action || item.phase;
                    const desc = item.description || item.goal || item.status;
                    const isEven = index % 2 === 0;

                    return (
                        <div key={index} className={`relative flex items-center justify-between md:justify-normal ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                            {/* Dot with Pulse Effect */}
                            <div className={`absolute left-6 md:left-1/2 flex items-center justify-center -translate-x-1/2 z-10`}>
                                <div className={`w-6 h-6 ${dotColor} rounded-full border-4 border-white shadow-md group-hover:scale-125 transition-transform duration-300 relative`}>
                                    <div className={`absolute inset-0 rounded-full ${dotColor} animate-ping opacity-20`}></div>
                                </div>
                            </div>

                            {/* Content Width Spacer */}
                            <div className="hidden md:block w-5/12"></div>

                            {/* Content Box */}
                            <div className={`w-[calc(100%-4rem)] md:w-5/12 ml-16 md:ml-0 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/card">
                                    {/* Image (if present) */}
                                    {item.image && (
                                        <div className="w-full h-48 mb-4 overflow-hidden rounded-xl border border-gray-100">
                                            <img
                                                src={item.image}
                                                alt={title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Decorative Top Line */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${dotColor} opacity-0 group-hover/card:opacity-100 transition-opacity`}></div>

                                    {/* Arrow/Connector logic could go here but tricky with responsive */}

                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                        {badge && (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold ${dateColor} uppercase tracking-wider`}>
                                                <Calendar size={12} /> {badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`text-xl font-bold ${textColor} mb-2 group-hover/card:text-blue-600 transition-colors`}>{title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(Timeline);
