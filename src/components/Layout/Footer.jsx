import { useBuilder } from '../../context/BuilderContext';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Edit, Youtube, Instagram, Github, Globe, Settings } from 'lucide-react';
import { useMemo } from 'react';

const Footer = ({ config }) => {
    const { isEditing, setSelectedComponent } = useBuilder();
    const {
        showFooter = true,
        backgroundColor = 'bg-slate-900',
        columns: configColumns = [],
        copyrightText = `© ${new Date().getFullYear()} My Website. All rights reserved.`,
        bottomLinks = [],
        showDividers = false // New: show dividers between rows and columns
    } = config;

    // Use columns from config directly
    const columns = configColumns;

    // Compute luminance and determine text colors automatically
    const textColors = useMemo(() => {
        let luminance = 0.1; // Default to dark
        
        // Check if it's a hex color or Tailwind class
        if (backgroundColor.startsWith('#')) {
            // Calculate luminance from hex color
            const hex = backgroundColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) / 255;
            const g = parseInt(hex.substr(2, 2), 16) / 255;
            const b = parseInt(hex.substr(4, 2), 16) / 255;
            
            // Relative luminance formula
            const [rs, gs, bs] = [r, g, b].map(c => 
                c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );
            luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        } else {
            // Extract color from Tailwind class
            const colorMatch = backgroundColor.match(/bg-(\w+)-(\d+)|bg-(\w+)/);
            
            // Tailwind color luminance map
            const luminanceMap = {
                'slate-900': 0.1, 'slate-800': 0.15, 'gray-900': 0.1, 'gray-800': 0.15,
                'blue-900': 0.12, 'blue-800': 0.18, 'black': 0.0,
                'white': 1.0, 'slate-50': 0.95, 'slate-100': 0.9, 'gray-50': 0.95, 
                'gray-100': 0.9, 'blue-50': 0.92, 'blue-100': 0.88
            };

            if (colorMatch) {
                const fullColor = colorMatch[3] || `${colorMatch[1]}-${colorMatch[2]}`;
                luminance = luminanceMap[fullColor] ?? 0.1;
            }
        }

        const isDark = luminance < 0.5;

        return {
            isDark,
            heading: isDark ? 'text-gray-200' : 'text-gray-800',
            body: isDark ? 'text-gray-400' : 'text-gray-600',
            icon: isDark ? 'text-gray-500' : 'text-gray-500',
            link: isDark ? 'text-blue-400' : 'text-blue-600',
            linkHover: isDark ? 'hover:text-blue-300' : 'hover:text-blue-700',
            socialBg: isDark ? 'bg-gray-800' : 'bg-gray-200',
            socialText: isDark ? 'text-gray-400' : 'text-gray-600',
            socialHover: isDark ? 'hover:bg-blue-600 hover:text-white' : 'hover:bg-blue-600 hover:text-white',
            divider: isDark ? 'border-gray-800' : 'border-gray-300',
            subFooterBg: isDark ? 'bg-black/30' : 'bg-gray-100',
            subFooterText: isDark ? 'text-gray-500' : 'text-gray-600'
        };
    }, [backgroundColor]);

    // Visibility Logic
    if (!showFooter && !isEditing) return null;

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return Facebook;
            case 'twitter': return Twitter;
            case 'linkedin': return Linkedin;
            case 'youtube': return Youtube;
            case 'instagram': return Instagram;
            case 'github': return Github;
            case 'zalo': return Phone;
            default: return Globe;
        }
    };

    const renderColumnContent = (col) => {
        const { data } = col;
        
        return (
            <div className="break-words">
                {data.title && <h3 className={`text-lg font-bold ${textColors.heading} break-words mb-4`}>{data.title}</h3>}

                {data.content && (
                    <p className={`${textColors.body} text-sm leading-relaxed mb-4 whitespace-pre-line break-words`}>
                        {data.content}
                    </p>
                )}

                <div className={`space-y-3 ${textColors.body} text-sm mb-4 break-words`}>
                    {data.address && (
                        <div className="flex items-start gap-3">
                            <MapPin size={16} className={`mt-1 flex-shrink-0 ${textColors.icon}`} />
                            <span>{data.address}</span>
                        </div>
                    )}
                    {data.phone && (
                        <div className="flex items-center gap-3">
                            <Phone size={16} className={textColors.icon} />
                            <span>{data.phone}</span>
                        </div>
                    )}
                    {data.email && (
                        <div className="flex items-center gap-3">
                            <Mail size={16} className={textColors.icon} />
                            <span>{data.email}</span>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                {data.links && data.links.length > 0 && (
                    <ul className="space-y-2 text-sm mb-4">
                        {data.links.map((link, idx) => (
                            <li key={idx}>
                                <a
                                    href={link.link}
                                    className={`${textColors.link} ${textColors.linkHover} transition-colors inline-block`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {data.socialLinks && data.socialLinks.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {(data.socialLinks || []).map((link, index) => {
                            const Icon = getSocialIcon(link.platform);
                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    className={`p-2 ${textColors.socialBg} ${textColors.socialText} rounded-lg ${textColors.socialHover} transition-colors`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={link.platform}
                                >
                                    <Icon size={18} />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <footer 
            className={`relative group ${!showFooter ? 'opacity-50 grayscale border-t-4 border-red-500' : ''}`}
            style={{ 
                backgroundColor: backgroundColor.startsWith('#') ? backgroundColor : undefined 
            }}
        >
            <div className={backgroundColor.startsWith('#') ? '' : backgroundColor}>
            {/* Hidden Indicator for Builder */}
            {!showFooter && isEditing && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 font-bold z-20">
                    HIDDEN (ADMIN ONLY)
                </div>
            )}

            {/* Section Controls for Footer */}
            {isEditing && (
                <>
                    <div className="absolute top-0 left-0 right-0 pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="container mx-auto px-4 py-2 flex justify-between items-center pointer-events-auto">
                            <div className="bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                FOOTER
                            </div>
                            <div className="bg-white shadow-lg rounded-lg flex overflow-hidden border border-gray-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedComponent({ type: 'Footer', data: config });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium text-sm transition-colors"
                                    title="Chỉnh sửa Footer"
                                >
                                    <Settings size={16} />
                                    <span className="hidden sm:inline">Chỉnh sửa</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-dashed border-blue-300 pointer-events-none z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </>
            )}

            {/* Main Footer - Navigation Columns */}
            {columns.length > 0 && (
                <div className={`border-b ${textColors.divider}`}>
                    <div className="container mx-auto px-4 py-8">
                        {/* Group columns by rowNumber */}
                        {(() => {
                            // Group columns by row number first
                            const rowGroups = {};
                            columns.forEach((col, idx) => {
                                const rowNum = col.rowNumber || 1;
                                if (!rowGroups[rowNum]) {
                                    rowGroups[rowNum] = [];
                                }
                                rowGroups[rowNum].push({ ...col, originalIndex: idx });
                            });
                            
                            // Sort rows by row number
                            const sortedRows = Object.keys(rowGroups).sort((a, b) => parseInt(a) - parseInt(b));
                            
                            return sortedRows.map((rowNum, rowIndex) => {
                                // Sort columns within each row by order property
                                const rowColumns = rowGroups[rowNum].sort((a, b) => {
                                    const orderA = a.order || 0;
                                    const orderB = b.order || 0;
                                    return orderA - orderB;
                                });
                                const colCount = rowColumns.length;
                                const isLastRow = rowIndex === sortedRows.length - 1;
                                
                                return (
                                    <div key={rowNum}>
                                        <div className={`grid gap-8 items-start ${
                                            colCount === 1 ? 'grid-cols-1' :
                                            colCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                            colCount === 3 ? 'grid-cols-1 md:grid-cols-3' :
                                            colCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                                            colCount === 5 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5' :
                                            colCount === 6 ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6' :
                                            'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
                                        }`}>
                                            {rowColumns.map((col, colIndex) => {
                                                const globalIndex = col.originalIndex;
                                                const isLastCol = colIndex === rowColumns.length - 1;
                                                const Wrapper = col.link ? 'a' : 'div';
                                                const props = col.link ? { 
                                                    href: col.link, 
                                                    className: "block hover:opacity-80 transition-opacity" 
                                                } : { 
                                                    className: "" 
                                                };

                                                return (
                                                    <div key={globalIndex} className="relative min-h-32 py-6 px-4">
                                                        <div className="overflow-hidden">
                                                            <Wrapper {...props}>
                                                                {renderColumnContent(col)}
                                                            </Wrapper>
                                                        </div>
                                                        
                                                        {/* Horizontal Divider under each column (except last row) */}
                                                        {showDividers && !isLastRow && (
                                                            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ bottom: '-2rem' }}>
                                                                <div className={`w-20 border-t-2 ${textColors.divider}`}></div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Vertical Divider on right of each column (except last column in row) */}
                                                        {showDividers && !isLastCol && (
                                                            <div className="absolute top-0 pointer-events-none hidden lg:flex" style={{ right: '-2rem', height: '100%' }}>
                                                                <div className={`h-full border-r-2 ${textColors.divider}`}></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* Add spacing between rows */}
                                        {!isLastRow && <div className="h-16"></div>}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}

            {/* Sub-Footer (Bottom Bar) - Legal & Secondary Info */}
            <div className={`${textColors.subFooterBg} border-t ${textColors.divider}`}>
                <div className="container mx-auto px-4 py-6">
                    <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${textColors.subFooterText}`}>
                        {/* Copyright */}
                        <div className="text-center md:text-left">
                            {copyrightText}
                        </div>
                        
                        {/* Bottom Links (Privacy, Terms, etc.) */}
                        {bottomLinks && bottomLinks.length > 0 && (
                            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
                                {bottomLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.link}
                                        className={`${textColors.link} ${textColors.linkHover} transition-colors`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
