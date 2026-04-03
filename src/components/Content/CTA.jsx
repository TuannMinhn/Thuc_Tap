import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = ({ data, isEditing }) => {
    const {
        label = "Button",
        link = "#",
        style = "primary", // primary, secondary, outline, ghost
        size = "medium", // small, medium, large
        align = "center", // left, center, right
        fullWidth = false,
        icon = false,
        backgroundColor
    } = data;

    const getBaseStyles = () => {
        let classes = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg transform active:scale-95";

        // Sizes
        if (size === 'small') classes += " px-4 py-2 text-sm";
        if (size === 'medium') classes += " px-6 py-3 text-base";
        if (size === 'large') classes += " px-10 py-4 text-lg shadow-lg hover:shadow-xl";

        // Styles
        if (style === 'primary') classes += " bg-blue-600 text-white hover:bg-blue-700 border-2 border-transparent";
        if (style === 'secondary') classes += " bg-slate-900 text-white hover:bg-slate-800 border-2 border-transparent";
        if (style === 'outline') classes += " bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50";
        if (style === 'ghost') classes += " bg-transparent text-slate-600 hover:bg-slate-100 border-2 border-transparent";

        // Width
        if (fullWidth) classes += " w-full";

        return classes;
    };

    const alignClass = {
        'left': 'justify-start',
        'center': 'justify-center',
        'right': 'justify-end'
    }[align] || 'justify-center';

    const Content = (
        <a
            href={link}
            className={getBaseStyles()}
            onClick={e => isEditing && e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
        >
            {label}
            {icon && <ArrowRight size={size === 'large' ? 24 : 18} className="ml-2" />}
        </a>
    );

    return (
        <div
            className={`w-full flex ${alignClass} py-2`}
            style={{ backgroundColor }}
        >
            {Content}
        </div>
    );
};

export default React.memo(CTA);
