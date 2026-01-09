import React from 'react';

const Section = ({ style = {}, children }) => {
    const {
        backgroundColor = 'bg-white',
        padding = 'py-16',
        textColor = '',
        backgroundImage,
        fullWidth = false,
        maxWidth = 'max-w-7xl',
        textAlign = 'text-left' // Default alignment
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

    return (
        <section
            className={`w-full ${backgroundColor} ${padding} ${textColor} relative transition-colors duration-300 flex flex-col justify-center`}
            style={sectionStyle}
        >
            <div className={`mx-auto w-full ${fullWidth ? 'px-4' : `container px-4 ${maxWidth}`}`}>
                {children}
            </div>
        </section>
    );
};

export default Section;
