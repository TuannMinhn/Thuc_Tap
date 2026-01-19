import React from 'react';

const RichText = ({ data, isEditing }) => {
    const { title, subtitle, content, align, contentStyle = {}, titleStyle = {}, subtitleStyle = {}, link } = data;

    const alignmentClass = {
        'text-left': 'text-left',
        'text-center': 'text-center',
        'text-right': 'text-right',
        'text-justify': 'text-justify',
    }[align] || '';

    const getClasses = (styleObj, defaultPreset) => {
        const { preset = defaultPreset, size = '', bold = false, italic = false, underline = false } = styleObj;

        const baseStyle = {
            h1: 'text-3xl font-extrabold mb-4',
            h2: 'text-2xl font-bold mb-3',
            h3: 'text-xl font-semibold mb-2',
            body: 'text-base leading-relaxed text-gray-600',
            caption: 'text-sm text-gray-500 italic',
        }[preset] || 'text-base';

        return [
            baseStyle,
            size,
            bold && 'font-bold',
            italic && 'italic',
            underline && 'underline',
        ].filter(Boolean).join(' ');
    };

    const isEmpty = !title && !subtitle && !content;

    const Content = () => {
        if (isEditing && isEmpty) {
            return (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-center flex flex-col items-center justify-center min-h-[100px] bg-gray-50/50">
                    <span className="italic">Chưa có nội dung</span>
                    <span className="text-xs mt-1">Nhấp để nhập văn bản</span>
                </div>
            );
        }

        return (
            <div className={`prose max-w-none ${alignmentClass} group`}>
                {title && (
                    <h2
                        className={`text-gray-800 ${getClasses(titleStyle, 'h2')} ${link ? 'group-hover:text-blue-600 transition-colors' : ''}`}
                        style={{ color: titleStyle.color }}
                    >
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <h3
                        className={`text-blue-600 ${getClasses(subtitleStyle, 'h3')}`}
                        style={{ color: subtitleStyle.color }}
                    >
                        {subtitle}
                    </h3>
                )}
                {content && (
                    <div
                        className={`whitespace-pre-line ${getClasses(contentStyle, 'body')}`}
                        style={{ color: contentStyle.color }}
                    >
                        {content}
                    </div>
                )}
            </div>
        );
    };

    return link ? (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => isEditing && e.preventDefault()}
            className="block hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors cursor-pointer"
        >
            <Content />
        </a>
    ) : (
        <Content />
    );
};

export default RichText;
