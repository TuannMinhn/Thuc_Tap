import { useBuilder } from '../../context/BuilderContext';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Edit, Youtube, Instagram, Github, Globe, ArrowUp, ArrowDown, Plus, Trash2, Settings } from 'lucide-react';

const Footer = ({ config }) => {
    const { isEditing, setSelectedComponent } = useBuilder();
    const {
        showFooter = true,
        backgroundColor = 'bg-slate-900',
        textColor = 'text-white',
        companyName = 'Industry Corp',
        contactInfo = {},
        socialLinks = [],
        columns: configColumns = [],
        copyrightText = `© ${new Date().getFullYear()} Khoa Công Nghệ Thông Tin. All rights reserved.`
    } = config;

    // Backward Compatibility Migration: If no columns, create them from old data
    const columns = configColumns.length > 0 ? configColumns : [
        {
            type: 'Info',
            data: { title: companyName, content: 'Leading the way in industrial innovation and sustainable manufacturing solutions.' }
        },
        {
            type: 'Contact',
            data: { title: 'Contact Us', ...contactInfo }
        },
        {
            type: 'Social',
            data: { title: 'Follow Us', socialLinks }
        }
    ];

    // Visibility Logic
    if (!showFooter && !isEditing) return null;
    if (columns.length === 0 && !isEditing) return null;

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return Facebook;
            case 'twitter': return Twitter;
            case 'linkedin': return Linkedin;
            case 'youtube': return Youtube;
            case 'instagram': return Instagram;
            case 'github': return Github;
            case 'zalo': return Phone; // Use Phone or MessageCircle as placeholder for Zalo
            default: return Globe;
        }
    };

    const renderColumnContent = (col) => {
        const { data } = col;
        return (
            <div>
                {data.title && <h3 className="text-xl font-bold mb-4">{data.title}</h3>}

                {data.content && (
                    <p className="opacity-80 leading-relaxed max-w-xs whitespace-pre-line mb-4">
                        {data.content}
                    </p>
                )}

                <div className="space-y-3 opacity-90 mb-4">
                    {data.address && (
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="mt-1 flex-shrink-0" />
                            <span>{data.address}</span>
                        </div>
                    )}
                    {data.phone && (
                        <div className="flex items-center gap-3">
                            <Phone size={18} />
                            <span>{data.phone}</span>
                        </div>
                    )}
                    {data.email && (
                        <div className="flex items-center gap-3">
                            <Mail size={18} />
                            <span>{data.email}</span>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                {data.links && data.links.length > 0 && (
                    <ul className="space-y-2 opacity-90 mb-4">
                        {data.links.map((link, idx) => (
                            <li key={idx}>
                                <a
                                    href={link.link}
                                    className="hover:text-blue-400 transition-colors inline-block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                {data.socialLinks && data.socialLinks.length > 0 && (
                    <div className="flex gap-4 flex-wrap">
                        {(data.socialLinks || []).map((link, index) => {
                            const Icon = getSocialIcon(link.platform);
                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    className="p-2 bg-white/10 rounded-full hover:bg-blue-600 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Icon size={20} />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <footer className={`relative group ${backgroundColor} ${textColor} py-12 ${!showFooter ? 'opacity-50 grayscale border-t-4 border-red-500' : ''}`}>
            {/* Hidden Indicator for Builder */}
            {!showFooter && isEditing && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 font-bold z-20">
                    HIDDEN (ADMIN ONLY)
                </div>
            )}

            {/* Section Controls (Like Section.jsx) for Footer */}
            {isEditing && (
                <div className="absolute top-0 left-0 right-0 h-full border-2 border-dashed border-transparent hover:border-blue-300 pointer-events-none z-10">
                    <div className="absolute -top-3 right-4 bg-white shadow-md rounded-md flex overflow-hidden border pointer-events-auto">
                        <button className="p-2 hover:bg-gray-100 text-gray-400 cursor-not-allowed border-r" title="Lên (Footer cố định)">
                            <ArrowUp size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 text-gray-400 cursor-not-allowed border-r" title="Xuống (Footer cố định)">
                            <ArrowDown size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponent({ type: 'Footer', data: config });
                            }}
                            className="flex items-center gap-1 px-3 py-2 hover:bg-blue-50 text-blue-600 font-medium text-xs border-r transition-colors"
                        >
                            <Settings size={14} /> Cài đặt
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // To add a column, we can open settings as that's where column management is
                                setSelectedComponent({ type: 'Footer', data: config });
                            }}
                            className="p-2 hover:bg-green-50 text-green-600 border-r"
                            title="Thêm cột (Vào cài đặt)"
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Toggle visibility - we need 'actions' from context to do this properly
                                // For now, let's open settings where the toggle is, or if we had actions access here we could call updateFooter
                                setSelectedComponent({ type: 'Footer', data: config });
                            }}
                            className="p-2 hover:bg-red-50 text-red-500"
                            title="Xóa/Ẩn Footer"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8 mb-8 justify-between">
                    {columns.map((col, index) => {
                        const Wrapper = col.link ? 'a' : 'div';
                        const props = col.link ? { href: col.link, className: "flex-1 block hover:opacity-80 transition-opacity relative group" } : { className: "flex-1 relative group" };

                        return (
                            <Wrapper key={index} {...props}>
                                {isEditing && (
                                    <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedComponent({ type: 'FooterColumn', data: col, index: index });
                                            }}
                                            className="bg-blue-600 text-white p-2 rounded shadow-lg hover:bg-blue-700"
                                            title="Sửa cột này"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </div>
                                )}
                                {renderColumnContent(col)}
                            </Wrapper>
                        );
                    })}
                </div>

                <div className="border-t border-white/10 pt-8 text-center opacity-60 text-sm">
                    {copyrightText}
                </div>
            </div>
        </footer>
    );
};



export default Footer;
