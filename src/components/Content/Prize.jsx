import React, { useEffect, useState } from 'react';
import { Award, Star, Trophy, Medal, Gift, Crown, Sparkles, TrendingUp } from 'lucide-react';

const Prize = ({ data }) => {
    const { items = [], style = {}, layout = 'vertical', blockTitle = 'Giải thưởng', blockTitleSize, blockTitleColor, backgroundColor } = data || {};
    // Animation state for stagger effect
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Default items
    const displayItems = items.length > 0 ? items : [
        {
            title: 'Thị Phần',
            description: 'Được bình chọn bởi người dùng 2024 tại Việt Nam.',
            value: 'Top #1',
            highlightColor: 'orange',
            icon: 'crown'
        },
        {
            title: 'Chi nhánh',
            description: 'Hệ thống chi nhánh trải dài khắp 63 tỉnh thành phố.',
            value: '50+',
            highlightColor: 'blue',
            icon: 'trending'
        },
        {
            title: 'Khách hàng',
            description: 'Khách hàng tin tưởng và sử dụng dịch vụ mỗi tháng.',
            value: '1M+',
            highlightColor: 'green',
            icon: 'star'
        },
    ];

    const getIcon = (iconName, colorClass) => {
        // Style matching the image: Thin stroke, Filled with transparency
        const props = {
            size: 24,
            strokeWidth: 1.5,
            className: `shrink-0 ${colorClass}`,
            fill: "currentColor",
            fillOpacity: 0.3
        };
        switch (iconName) {
            case 'trophy': return <Trophy {...props} />;
            case 'crown': return <Crown {...props} />;
            case 'medal': return <Medal {...props} />;
            case 'star': return <Star {...props} />;
            case 'gift': return <Gift {...props} />;
            case 'sparkles': return <Sparkles {...props} />;
            case 'trending': return <TrendingUp {...props} />;
            default: return <Award {...props} />;
        }
    };

    const getColorTheme = (color, intensity = 'medium') => {
        // Check if color is a hex code
        if (color && color.startsWith('#')) {
            const hex = color;
            // Helper to add opacity to hex
            const hexToRgba = (hex, alpha) => {
                let r = 0, g = 0, b = 0;
                if (hex.length === 4) {
                    r = parseInt("0x" + hex[1] + hex[1]);
                    g = parseInt("0x" + hex[2] + hex[2]);
                    b = parseInt("0x" + hex[3] + hex[3]);
                } else if (hex.length === 7) {
                    r = parseInt("0x" + hex[1] + hex[2]);
                    g = parseInt("0x" + hex[3] + hex[4]);
                    b = parseInt("0x" + hex[5] + hex[6]);
                }
                return `rgba(${r},${g},${b},${alpha})`;
            };

            const isSoft = intensity === 'soft';
            const isStrong = intensity === 'strong';

            return {
                bg: '',
                bgStyle: { backgroundColor: isStrong ? hexToRgba(hex, 0.2) : hexToRgba(hex, 0.1) },
                hoverBgStyle: { backgroundColor: hexToRgba(hex, 0.25) },

                text: '',
                textStyle: { color: hex },

                border: '',
                borderStyle: { borderColor: hexToRgba(hex, isSoft ? 0.3 : 0.5) },
                hoverBorderStyle: { borderColor: hex },

                gradient: '', // Custom handling for gradient
                gradientStyle: { backgroundImage: `linear-gradient(135deg, ${hexToRgba(hex, 0.2)}, ${hexToRgba(hex, 0.05)})` },

                // Helper for specific parts
                iconBgStyle: { backgroundImage: `linear-gradient(135deg, ${hexToRgba(hex, 0.3)}, ${hexToRgba(hex, 0.1)})` },
                pillStyle: {
                    backgroundColor: hexToRgba(hex, 0.1),
                    color: hex,
                    borderColor: hexToRgba(hex, 0.3)
                }
            };
        }

        // Base themes definitions
        const baseThemes = {
            orange: {
                bg: 'bg-orange-100',
                bgStrong: 'bg-orange-200',
                text: 'text-orange-600',
                textStrong: 'text-orange-800',
                border: 'border-orange-400',
                borderStrong: 'border-orange-600',
                gradient: 'from-orange-200 to-red-100'
            },
            blue: {
                bg: 'bg-blue-50',
                bgStrong: 'bg-blue-100',
                text: 'text-blue-600',
                textStrong: 'text-blue-700',
                border: 'border-blue-300',
                borderStrong: 'border-blue-500',
                gradient: 'from-blue-100 to-cyan-100'
            },
            green: {
                bg: 'bg-green-50',
                bgStrong: 'bg-green-100',
                text: 'text-green-600',
                textStrong: 'text-green-700',
                border: 'border-green-300',
                borderStrong: 'border-green-500',
                gradient: 'from-emerald-100 to-green-100'
            },
            purple: {
                bg: 'bg-purple-50',
                bgStrong: 'bg-purple-100',
                text: 'text-purple-600',
                textStrong: 'text-purple-700',
                border: 'border-purple-300',
                borderStrong: 'border-purple-500',
                gradient: 'from-purple-100 to-fuchsia-100'
            },
            red: {
                bg: 'bg-red-50',
                bgStrong: 'bg-red-100',
                text: 'text-red-600',
                textStrong: 'text-red-700',
                border: 'border-red-300',
                borderStrong: 'border-red-500',
                gradient: 'from-red-100 to-rose-100'
            },
            pink: {
                bg: 'bg-pink-50',
                bgStrong: 'bg-pink-100',
                text: 'text-pink-600',
                textStrong: 'text-pink-700',
                border: 'border-pink-300',
                borderStrong: 'border-pink-500',
                gradient: 'from-pink-100 to-rose-100'
            },
            cyan: {
                bg: 'bg-cyan-50',
                bgStrong: 'bg-cyan-100',
                text: 'text-cyan-600',
                textStrong: 'text-cyan-700',
                border: 'border-cyan-300',
                borderStrong: 'border-cyan-500',
                gradient: 'from-cyan-100 to-sky-100'
            },
            amber: {
                bg: 'bg-amber-50',
                bgStrong: 'bg-amber-100',
                text: 'text-amber-600',
                textStrong: 'text-amber-700',
                border: 'border-amber-300',
                borderStrong: 'border-amber-500',
                gradient: 'from-amber-100 to-yellow-100'
            },
        };

        const t = baseThemes[color] || baseThemes.orange;

        // Apply intensity modifiers for presets
        let modified = { ...t };
        if (intensity === 'soft') {
            modified = { ...t, border: t.border.replace('200', '100'), text: t.text.replace('600', '400') };
        } else if (intensity === 'strong') {
            modified = { ...t, bg: t.bgStrong, border: t.borderStrong, text: t.textStrong };
        }

        // Return standardized object for presets
        return {
            bg: modified.bg,
            bgStyle: {},
            bgStrongClass: modified.bgStrong || modified.bg, // For hover

            text: modified.text,
            textStyle: {},
            textStrongClass: modified.textStrong || modified.text,

            border: modified.border,
            borderStyle: {},
            borderStrongClass: modified.borderStrong || modified.border,

            gradient: modified.gradient,
            gradientStyle: {},

            iconBgStyle: {},
            pillStyle: {}
        };
    };



    // Standard Layout (Vertical)
    if (layout === 'vertical') {
        return (
            <div
                className="space-y-3 max-w-4xl mx-auto py-4 rounded-xl"
                style={{ backgroundColor }}
            >
                {displayItems.map((item, index) => renderPrizeItem(item, index))}
            </div>
        );
    }

    // Horizontal Layout (Side-by-Side like Example 1)
    return (
        <div
            className="max-w-6xl mx-auto py-8 px-4 rounded-xl"
            style={{ backgroundColor }}
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Big Title */}
                <div className="md:col-span-3">
                    <h2
                        className={`font-bold sticky top-8 leading-tight ${blockTitleColor ? '' : 'text-yellow-500'}`}
                        style={{
                            fontSize: `${blockTitleSize || 36}px`,
                            color: blockTitleColor
                        }}
                    >
                        {blockTitle}
                    </h2>
                </div>

                {/* Right Column: Prize List */}
                <div className="md:col-span-9 space-y-4">
                    {displayItems.map((item, index) => renderPrizeItem(item, index))}
                </div>
            </div>
        </div>
    );

    function renderPrizeItem(item, index) {
        const hoverIntensity = item.hoverIntensity || 'medium';


        const isTopPrize = index === 0 || item.icon === 'crown' || item.icon === 'trophy';

        // Auto-detect medal color
        let medalColorClass = "";
        let medalColorStyle = {};

        if (item.icon === 'medal') {
            if (index === 0 || item.title.toLowerCase().includes('nhất')) medalColorClass = "text-yellow-500";
            else if (index === 1 || item.title.toLowerCase().includes('nhì')) medalColorClass = "text-gray-400";
            else if (index === 2 || item.title.toLowerCase().includes('ba')) medalColorClass = "text-amber-700";
        }

        const theme = getColorTheme(item.highlightColor || 'amber', hoverIntensity);

        return (
            <div
                key={index}
                className={`
                    group relative flex items-center justify-between p-5
                    ${theme.bg} rounded-xl border ${theme.border}
                    shadow-sm hover:shadow-lg hover:-translate-y-0.5
                    ${hoverIntensity === 'soft' ? 'bg-opacity-50 hover:bg-opacity-80' : ''}
                    transition-all duration-150 ease-out will-change-transform
                    ${theme.bgStrongClass ? `hover:${theme.bgStrongClass}` : ''}
                `}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 100}ms`,
                    ...theme.bgStyle,
                    ...theme.borderStyle
                }}
            >
                {/* Hover Border Highlight Effect (Intensify on hover) */}
                <div
                    className={`
                        absolute inset-0 rounded-xl border-2 border-transparent 
                        pointer-events-none transition-colors duration-150
                        opacity-0 group-hover:opacity-100
                        ${theme.borderStrongClass ? `group-hover:${theme.borderStrongClass}` : ''}
                    `}
                    style={theme.hoverBorderStyle ? { borderColor: theme.hoverBorderStyle.borderColor } : {}}
                />

                {/* Left: Icon & Content */}
                <div className="flex items-center gap-5 flex-1 pr-6 z-10">
                    {/* Icon Container with Gradient */}
                    <div
                        className={`
                            w-14 h-14 rounded-full flex items-center justify-center shrink-0
                            bg-gradient-to-br ${theme.gradient || ''} bg-opacity-20
                            group-hover:bg-opacity-30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-150
                            relative overflow-hidden
                        `}
                        style={theme.gradientStyle || theme.iconBgStyle}
                    >
                        {/* Icon */}
                        <div className="relative z-10" style={theme.textStyle}>
                            {getIcon(item.icon, medalColorClass || theme.text || '')}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3
                            className={`text-lg font-bold ${theme.text} transition-colors duration-150 mb-1 ${theme.textStrongClass ? `group-hover:${theme.textStrongClass}` : ''}`}
                            style={theme.textStyle}
                        >
                            {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* Right: Value & Multiplier */}
                <div className="flex flex-col items-end gap-1.5 z-10">
                    <div className="relative overflow-hidden rounded-full group-hover:shadow-md transition-shadow duration-150">
                        {/* Value Pill */}
                        <span
                            className={`
                                relative z-10 inline-block px-5 py-2 rounded-full text-base font-bold
                                bg-gradient-to-r ${theme.gradient || ''} bg-opacity-30
                                ${theme.text} border ${theme.border}
                                transition-colors duration-150 whitespace-nowrap
                            `}
                            style={{
                                ...theme.pillStyle,
                                ...theme.textStyle,
                                ...theme.borderStyle
                            }}
                        >
                            {item.value}
                        </span>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20" />
                    </div>

                    {item.multiplier && (
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                            {item.multiplier}
                        </span>
                    )}
                </div>
            </div>
        );
    }
};

export default Prize;

