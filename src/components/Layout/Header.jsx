import { useBuilder } from '../../context/BuilderContext';
import { Menu, Search, User, Settings, ArrowUp, ArrowDown, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = ({ config }) => {
    const { isEditing, setSelectedComponent } = useBuilder();
    const {
        showHeader = true, // NEW: Show/hide header
        backgroundColor = 'bg-white',
        textColor = 'text-gray-900',
        title = 'Industry Hub',
        logo,
        menuItems = [],
        backgroundImage,
        backgroundVideo,
        layout = 'standard', // 'standard' | 'floating'
        ctaButtonLabel = 'Contact Us',
        ctaButtonLink = '#',
        enableSticky = true, // NEW: Enable sticky header
        enableSearch = true, // NEW: Enable search bar
    } = config;

    // NEW: State for sticky header
    const [isSticky, setIsSticky] = useState(false);
    
    // NEW: State for search bar
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // NEW: State for mobile menu
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // NEW: State for dropdown menus
    const [openDropdown, setOpenDropdown] = useState(null);

    // NEW: Sticky header effect
    useEffect(() => {
        if (!enableSticky || isEditing) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enableSticky, isEditing]);

    const headerStyle = {};
    if (backgroundImage) {
        headerStyle.backgroundImage = `url(${backgroundImage})`;
        headerStyle.backgroundSize = 'cover';
        headerStyle.backgroundPosition = 'center';
    }

    // Dynamic Classes based on layout
    const isFloating = layout === 'floating';

    // Base container classes with sticky support
    let containerClasses = `relative shadow-md transition-all duration-300 ${textColor}`;
    
    // NEW: Add sticky classes
    if (enableSticky && isSticky && !isEditing) {
        containerClasses += ' fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top';
    }

    if (isFloating) {
        containerClasses += ` w-[95%] max-w-7xl mx-auto mt-6 rounded-full px-6 z-50 ${backgroundColor}`;
    } else {
        containerClasses += ` w-full ${backgroundColor}`;
    }

    // NEW: Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
        // TODO: Implement search functionality
        alert(`Tìm kiếm: ${searchQuery}`);
        setSearchOpen(false);
        setSearchQuery('');
    };

    // NEW: Handle dropdown toggle
    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    // Visibility Logic - Hide header if showHeader is false (except in editing mode)
    if (!showHeader && !isEditing) return null;

    return (
        <header className={`relative group ${containerClasses} ${!showHeader ? 'opacity-50 grayscale border-b-4 border-red-500' : ''}`} style={isFloating ? {} : headerStyle}>
            {/* Enhanced Editor Controls for Header - Only show on hover */}
            {isEditing && (
                <div className="absolute top-0 left-0 right-0 pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Floating Toolbar - Visible on hover */}
                    <div className="container mx-auto px-4 py-2 flex justify-between items-center pointer-events-auto">
                        {/* Left: Label */}
                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            HEADER
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="bg-white shadow-lg rounded-lg flex overflow-hidden border border-gray-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComponent({ type: 'Header', data: config });
                                }}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium text-sm transition-colors"
                                title="Chỉnh sửa Header (Logo, Màu sắc, Menu, Button...)"
                            >
                                <Settings size={16} />
                                <span className="hidden sm:inline">Chỉnh sửa</span>
                            </button>
                        </div>
                    </div>

                    {/* Hover Border - Subtle indicator */}
                    <div className={`absolute top-0 left-0 right-0 bottom-0 border-2 border-dashed border-blue-300 pointer-events-none ${isFloating ? 'rounded-full' : ''}`}></div>
                </div>
            )}

            {/* Hidden Indicator for Builder */}
            {!showHeader && isEditing && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 font-bold z-20">
                    HIDDEN (ADMIN ONLY)
                </div>
            )}
            
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

            <div className={`container mx-auto py-3 relative z-10 flex items-center justify-between ${isFloating ? 'px-2' : 'px-4'}`}>
                {/* Logo / Title */}
                <div className="flex items-center gap-3">
                    {logo && <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />}
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                </div>

                {/* Desktop Menu with Dropdown Support */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item, index) => (
                        <div key={index} className="relative">
                            {/* Menu item with dropdown */}
                            {item.children && item.children.length > 0 ? (
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown(index)}
                                        className="hover:opacity-75 font-medium transition-opacity px-2 py-1 rounded-md hover:bg-black/5 flex items-center gap-1"
                                        aria-label={`Toggle ${item.label} menu`}
                                    >
                                        {item.label}
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform ${openDropdown === index ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {openDropdown === index && (
                                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {item.children.map((child, childIndex) => (
                                                <a
                                                    key={childIndex}
                                                    href={child.link || '#'}
                                                    className="block px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    {child.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a
                                    href={item.link || '#'}
                                    className="hover:opacity-75 font-medium transition-opacity px-2 py-1 rounded-md hover:bg-black/5"
                                >
                                    {item.label}
                                </a>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Icons / Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Button */}
                    {enableSearch && (
                        <button 
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 hover:bg-black/10 rounded-full transition-colors hidden md:block"
                            aria-label={searchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
                        >
                            {searchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>
                    )}

                    {ctaButtonLabel && (
                        <a
                            href={ctaButtonLink}
                            className={`hidden md:block px-6 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-95 ${layout === 'floating'
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {ctaButtonLabel}
                        </a>
                    )}

                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-black/10 rounded-full"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Bar Overlay */}
            {enableSearch && searchOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-300 z-[60]">
                    <div className="container mx-auto px-4 py-4">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                                Tìm kiếm
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-300">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                        {menuItems.map((item, index) => (
                            <div key={index}>
                                {item.children && item.children.length > 0 ? (
                                    <div>
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg font-medium flex items-center justify-between"
                                        >
                                            {item.label}
                                            <ChevronDown 
                                                size={16} 
                                                className={`transition-transform ${openDropdown === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openDropdown === index && (
                                            <div className="pl-4 mt-1">
                                                {item.children.map((child, childIndex) => (
                                                    <a
                                                        key={childIndex}
                                                        href={child.link || '#'}
                                                        className="block px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {child.label}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <a
                                        href={item.link || '#'}
                                        className="block px-4 py-3 hover:bg-gray-100 rounded-lg font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                )}
                            </div>
                        ))}
                        {ctaButtonLabel && (
                            <a
                                href={ctaButtonLink}
                                className="block px-4 py-3 bg-blue-600 text-white text-center rounded-lg font-bold hover:bg-blue-700 transition-colors mt-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {ctaButtonLabel}
                            </a>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
