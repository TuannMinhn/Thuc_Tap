import React from 'react';
import { Play } from 'lucide-react';

const Media = ({ data, isEditing }) => {
    const { type, src, alt, caption, aspectRatio = 'aspect-video', link, fullWidth, autoPlay, muted, loop, controls = true, backgroundColor } = data;

    const getYoutubeEmbed = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = type === 'video' ? getYoutubeEmbed(src) : null;
    const isGif = src?.toLowerCase()?.includes('.gif') || src?.includes('data:image/gif');

    const Content = () => (
        <div className={`relative group w-full ${fullWidth ? 'h-full' : ''}`}>
            {/* Decorative Backdrop Blur */}
            {!fullWidth && (
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            )}

            <div className={`relative w-full ${fullWidth ? 'h-full' : aspectRatio} overflow-hidden ${fullWidth ? 'rounded-none shadow-none' : 'rounded-2xl shadow-2xl bg-gray-900 border-4 border-white/10 ring-1 ring-black/5'}`}>
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
                    <>
                        <img
                            src={src || 'https://via.placeholder.com/800x450?text=Image+Placeholder'}
                            alt={alt || 'Content Image'}
                            className={`w-full h-full object-cover transition-transform duration-700 ${fullWidth ? '' : 'hover:scale-105'}`}
                        />
                        {/* Overlay Gradient for better text readability or depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </>
                )}

                {link && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                        <span className="bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Truy cập liên kết ↗
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            className={`w-full ${fullWidth ? 'h-full' : 'p-4'} ${!fullWidth && backgroundColor ? 'rounded-xl' : ''}`}
            style={{ backgroundColor }}
        >
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className={`block w-full ${fullWidth ? 'h-full' : ''}`}>
                    <Content />
                </a>
            ) : (
                <Content />
            )}

            {caption && (
                <div className="mt-4 flex justify-center">
                    <p className="relative inline-block px-6 py-2 bg-white/80 backdrop-blur border border-gray-100 rounded-full shadow-sm text-sm text-gray-600 font-medium italic">
                        {caption}
                    </p>
                </div>
            )}
        </div >
    );
};

export default React.memo(Media);
