import React from 'react';

const Stats = ({ data, isEditing }) => {
    const { items = [], styles = {}, backgroundColor: containerBg } = data;

    // Default styles (Yellow theme defaults)
    const {
        backgroundColor = '#fffbeb70', // yellow-50/50
        borderColor = '#fef08a',      // yellow-200
        valueColor = '#ca8a04',       // yellow-600
        labelColor = '#6b7280'        // gray-500
    } = styles;

    // Empty State
    if (!items || items.length === 0) {
        return (
            <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50/50">
                <span className="text-sm font-medium">Chưa có số liệu (Trống)</span>
            </div>
        );
    }

    // Dynamic Grid Layout based on Item Count
    const getGridClass = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2';
        if (count === 3) return 'grid-cols-1 md:grid-cols-3';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'; // Default/4 items
    };

    return (
        <div
            className={`w-full ${containerBg ? 'p-6 rounded-xl' : ''}`}
            style={{ backgroundColor: containerBg }}
        >
            <div className={`grid gap-6 ${getGridClass(items.length)}`}>
                {items.map((item, index) => {
                    const isLink = !!item.link;
                    const Component = isLink ? 'a' : 'div';

                    return (
                        <Component
                            key={index}
                            href={isLink ? item.link : undefined}
                            target={isLink ? "_blank" : undefined}
                            rel={isLink ? "noopener noreferrer" : undefined}
                            onClick={(e) => {
                                // If editing, prevent navigation but allow selection
                                if (isEditing) {
                                    e.preventDefault();
                                }
                            }}
                            className={`p-6 md:p-8 border rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 ${isLink ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''}`}
                            style={{ backgroundColor, borderColor }}
                        >
                            {/* Value */}
                            <span
                                className={`font-bold block mb-2 ${items.length === 1 ? 'text-5xl md:text-6xl' : 'text-3xl md:text-5xl'}`}
                                style={{ color: valueColor }}
                            >
                                {item.value}
                            </span>

                            {/* Label */}
                            <span
                                className="text-sm md:text-base font-bold uppercase tracking-wider mb-2"
                                style={{ color: labelColor }}
                            >
                                {item.label}
                            </span>

                            {/* Description (Optional) */}
                            {item.description && (
                                <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </Component>
                    );
                })}
            </div>
        </div>
    );
};

export default Stats;
