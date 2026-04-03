import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

/**
 * SectionPreview - Component hiển thị preview của section trên landing page
 * Hiển thị thông tin tóm gọn với CTA button dẫn đến trang chi tiết
 */
const SectionPreview = ({ section, isEditing }) => {
    const { id, preview } = section;
    
    if (!preview) return null;

    const {
        title,
        subtitle,
        description,
        image,
        icon,
        ctaText = "Xem chi tiết",
        ctaLink = `/landing/${id}`
    } = preview;

    return (
        <div className={`group relative ${isEditing ? 'border-2 border-dashed border-blue-300 p-4 rounded-lg' : ''}`}>
            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image */}
                {image && (
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={image} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {icon && (
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg">
                                <span className="text-2xl">{icon}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {subtitle && (
                        <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                            {subtitle}
                        </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {description}
                    </p>

                    {/* CTA Button */}
                    <Link
                        to={ctaLink}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all hover:gap-3 group/btn"
                    >
                        {ctaText}
                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Editor Indicator */}
            {isEditing && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    PREVIEW MODE
                </div>
            )}
        </div>
    );
};

export default SectionPreview;
