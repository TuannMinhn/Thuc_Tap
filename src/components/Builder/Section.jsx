import React from 'react';

const Section = ({ style = {}, anchorId, children }) => {
    const {
        backgroundColor = 'bg-white',
        padding = 'py-16',
        textColor = '',
        backgroundImage,
        fullWidth = false,
        maxWidth = 'max-w-7xl',
        textAlign = 'text-left', // Default alignment
        gap = 'gap-6',           // Gap between columns
        border = '',             // Border styles
        shadow = '',             // Shadow styles
        borderRadius = '',       // Border radius
    } = style;

    const sectionStyle = {};
    if (backgroundImage) {
        if (backgroundImage.startsWith('linear-gradient') || backgroundImage.startsWith('radial-gradient')) {
            sectionStyle.backgroundImage = backgroundImage;
        } else {
            sectionStyle.backgroundImage = `url(${backgroundImage})`;
            sectionStyle.backgroundSize = 'cover';
            sectionStyle.backgroundPosition = 'center';
        }
    }

    // Combine all the style classes
    const sectionClasses = [
        'w-full',
        backgroundColor,
        padding,
        textColor,
        border && border !== 'border-none' ? border : '',
        shadow && shadow !== 'shadow-none' ? shadow : '',
        borderRadius && borderRadius !== 'rounded-none' ? borderRadius : '',
        'relative transition-colors duration-300 flex flex-col justify-center'
    ].filter(Boolean).join(' ');

    return (
        <section
            id={anchorId || undefined}
            className={sectionClasses}
            style={sectionStyle}
        >
            <div className={`mx-auto w-full ${fullWidth ? 'px-4' : `container px-4 ${maxWidth}`}`}>
                {children}
            </div>
        </section>
    );
};

export default Section;
