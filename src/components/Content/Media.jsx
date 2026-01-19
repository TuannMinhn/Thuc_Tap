import React from 'react';

const Media = ({ data, isEditing }) => {
    const { type, src, alt, caption, aspectRatio = 'aspect-video', link, fullWidth, autoPlay, muted, loop, controls = true } = data;

    const getYoutubeEmbed = (url) => {
        if (!url) return null;
        // Regex to match YouTube ID from various URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = type === 'video' ? getYoutubeEmbed(src) : null;
    const isGif = src?.toLowerCase()?.includes('.gif') || src?.includes('data:image/gif');

    const Content = () => (
        <div className={`relative w-full ${aspectRatio} overflow-hidden group ${fullWidth ? 'rounded-none shadow-none' : 'rounded-lg shadow-sm bg-gray-100'}`}>
            {type === 'video' && !isGif ? (
                youtubeId ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeId}&controls=${controls ? 1 : 0}`}
                        title={alt || 'YouTube video player'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <video
                        src={src}
                        controls={controls}
                        autoPlay={autoPlay}
                        muted={muted}
                        loop={loop}
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        Your browser does not support the video tag.
                    </video>
                )
            ) : (
                <img
                    src={src || 'https://via.placeholder.com/800x450?text=Image+Placeholder'}
                    alt={alt || 'Content Image'}
                    className={`w-full h-full object-cover transition-transform duration-500 ${fullWidth ? '' : 'hover:scale-105'}`}
                />
            )}
            {link && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-white/90 text-black text-xs px-2 py-1 rounded shadow pointer-events-auto">Open Link ↗</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full">
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Content />
                </a>
            ) : (
                <Content />
            )}

            {caption && <p className="mt-2 text-sm text-center text-gray-500 italic">{caption}</p>}
        </div >
    );
};

export default Media;
