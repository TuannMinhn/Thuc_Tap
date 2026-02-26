import { useBuilder } from '../../context/BuilderContext';
import { Menu, Search, User, Settings, ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';

const Header = ({ config }) => {
    const { isEditing, setSelectedComponent } = useBuilder();
    const {
        backgroundColor = 'bg-white',
        textColor = 'text-gray-900',
        title = 'Industry Hub',
        logo,
        menuItems = [],
        backgroundImage,
        backgroundVideo,
        layout = 'standard', // 'standard' | 'floating'
        actionButtonLabel = 'Contact Us',
        actionButtonLink = '#'
    } = config;

    const headerStyle = {};
    if (backgroundImage) {
        headerStyle.backgroundImage = `url(${backgroundImage})`;
        headerStyle.backgroundSize = 'cover';
        headerStyle.backgroundPosition = 'center';
    }

    // Dynamic Classes based on layout
    const isFloating = layout === 'floating';

    // Base container classes
    let containerClasses = `relative shadow-md transition-all duration-300 ${textColor}`;

    // Apply background only if not standard (standard applies it to full width header)
    // Actually, for standard, we want full width background.
    // For floating, we want the pill to have the background.

    if (isFloating) {
        containerClasses += ` w-[95%] max-w-7xl mx-auto mt-6 rounded-full px-6 z-50 ${backgroundColor}`;
    } else {
        containerClasses += ` w-full ${backgroundColor}`;
    }

    return (
        <header className={containerClasses} style={isFloating ? {} : headerStyle}>
            {backgroundVideo && !isFloating && (
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover opacity-50"
                    >
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Background for Floating Mode (if image/video needed inside the pill) */}
            {isFloating && (backgroundImage || backgroundVideo) && (
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 rounded-full">
                    {backgroundVideo ? (
                        <video autoPlay loop muted className="w-full h-full object-cover opacity-50">
                            <source src={backgroundVideo} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="w-full h-full bg-cover bg-center" style={headerStyle} />
                    )}
                </div>
            )}

            {/* Section Controls (Like Section.jsx) for Header */}
            {isEditing && (
                <div className={`absolute top-0 left-0 right-0 h-full border-2 border-dashed border-transparent hover:border-blue-300 pointer-events-none z-20 ${isFloating ? 'rounded-full' : ''}`}>
                    <div className="absolute top-4 right-4 bg-white shadow-md rounded-md flex overflow-hidden border pointer-events-auto">
                        <button className="p-2 hover:bg-gray-100 text-gray-400 cursor-not-allowed border-r" title="Lên (Header cố định)">
                            <ArrowUp size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 text-gray-400 cursor-not-allowed border-r" title="Xuống (Header cố định)">
                            <ArrowDown size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponent({ type: 'Header', data: config });
                            }}
                            className="flex items-center gap-1 px-3 py-2 hover:bg-blue-50 text-blue-600 font-medium text-xs border-r transition-colors"
                        >
                            <Settings size={14} /> Cài đặt
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponent({ type: 'Header', data: config });
                            }}
                            className="p-2 hover:bg-gray-100 text-gray-400 cursor-help border-r"
                            title="Thêm menu (Vào cài đặt)"
                        >
                            <Plus size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComponent({ type: 'Header', data: config });
                            }}
                            className="p-2 hover:bg-red-50 text-red-500"
                            title="Xóa/Ẩn Header"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className={`container mx-auto py-3 relative z-10 flex items-center justify-between ${isFloating ? 'px-2' : 'px-4'}`}>
                {/* Logo / Title */}
                <div className="flex items-center gap-3">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />}
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.link || '#'}
                            className="hover:opacity-75 font-medium transition-opacity px-2 py-1 rounded-md hover:bg-black/5"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Icons / Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-black/10 rounded-full transition-colors hidden md:block">
                        <Search size={20} />
                    </button>

                    {actionButtonLabel && (
                        <a
                            href={actionButtonLink}
                            className={`hidden md:block px-6 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-95 ${layout === 'floating'
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' // Gold style for floating as seen in image
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {actionButtonLabel}
                        </a>
                    )}

                    <button className="md:hidden p-2 hover:bg-black/10 rounded-full">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
