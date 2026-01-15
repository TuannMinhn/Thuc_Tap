import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { X, Save, Layout, Palette, Monitor, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, Check, GalleryHorizontal } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const SectionSettingsModal = () => {
    const { config, setConfig, activeSectionId, setActiveSectionId } = useBuilder();
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    // Gradient Builder State
    const [colorMode, setColorMode] = useState('preset'); // 'preset' | 'custom'
    const [customColors, setCustomColors] = useState(['#2563eb', '#06b6d4']);
    const [customDir, setCustomDir] = useState('to right');

    const updateCustomGradient = (colors, dir) => {
        const gradient = `linear-gradient(${dir}, ${colors.join(', ')})`;
        updateStyle('backgroundImage', gradient);
        updateStyle('backgroundColor', 'transparent');
        // We don't force textColor here, let user keep current or auto-contrast logic elsewhere
    };

    const handleAddColor = () => {
        if (customColors.length < 3) {
            const newColors = [...customColors, '#ffffff'];
            setCustomColors(newColors);
            updateCustomGradient(newColors, customDir);
        }
    };

    const handleRemoveColor = (index) => {
        if (customColors.length > 1) {
            const newColors = customColors.filter((_, i) => i !== index);
            setCustomColors(newColors);
            updateCustomGradient(newColors, customDir);
        }
    };

    const handleColorChange = (index, val) => {
        const newColors = [...customColors];
        newColors[index] = val;
        setCustomColors(newColors);
        updateCustomGradient(newColors, customDir);
    };

    const handleDirChange = (val) => {
        setCustomDir(val);
        updateCustomGradient(customColors, val);
    };

    useLockBodyScroll(!!activeSectionId);

    useEffect(() => {
        if (activeSectionId) {
            const section = config.sections.find(s => s.id === activeSectionId);
            if (section) {
                const deepCopy = JSON.parse(JSON.stringify(section));
                setFormData(deepCopy);
                setInitialData(deepCopy);
            }
        }
    }, [activeSectionId, config]);

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

    const handleClose = () => {
        setActiveSectionId(null);
        setFormData(null);
    };

    const handleSaveClick = () => {
        if (!formData) return;
        setShowSaveConfirm(true);
    };

    const handleConfirmSave = (applyToContent) => {
        let updatedSection = { ...formData };

        if (applyToContent) {
            // Reset 'align' of all components to inherit from section
            updatedSection.columns = updatedSection.columns.map(col => ({
                ...col,
                components: col.components.map(comp => ({
                    ...comp,
                    data: {
                        ...comp.data,
                        align: '' // Clear specific alignment to force inheritance
                    }
                }))
            }));
        }

        // Update the global config
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === activeSectionId ? updatedSection : s)
        }));

        setShowSaveConfirm(false);
        handleClose();
    };

    const updateStyle = (key, value) => {
        setFormData(prev => ({
            ...prev,
            style: { ...prev.style, [key]: value }
        }));
    };

    const updateColumns = (count) => {
        const targetCols = parseInt(count);
        if (isNaN(targetCols) || targetCols < 1) return;

        let newColumns = [...formData.columns];
        if (newColumns.length < targetCols) {
            for (let i = newColumns.length; i < targetCols; i++) {
                newColumns.push({ components: [] });
            }
        } else if (newColumns.length > targetCols) {
            // Optional: Ask for confirmation if checking length
            newColumns = newColumns.slice(0, targetCols);
        }

        setFormData(prev => ({
            ...prev,
            layout: `${targetCols}-col`,
            columns: newColumns
        }));
    };

    if (!activeSectionId || !formData) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <SettingsIcon /> Cấu hình Section
                    </h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8 flex-1">

                    {/* Layout Settings */}
                    <section>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Layout size={16} /> Bố cục & Cột
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng cột ({formData.columns.length})</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="6"
                                    value={formData.columns.length}
                                    onChange={(e) => updateColumns(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chiều rộng nội dung</label>
                                    <div className="flex gap-2 mb-3">
                                        <button
                                            onClick={() => updateStyle('fullWidth', false)}
                                            className={`flex-1 p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${!formData.style?.fullWidth ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            <BoxedIcon />
                                            <span className="text-xs font-medium">Giới hạn (Container)</span>
                                        </button>
                                        <button
                                            onClick={() => updateStyle('fullWidth', true)}
                                            className={`flex-1 p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${formData.style?.fullWidth ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            <FullWidthIcon />
                                            <span className="text-xs font-medium">Tràn màn hình</span>
                                        </button>
                                    </div>

                                    {!formData.style?.fullWidth && (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Kích thước tùy chỉnh</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-600 mb-1 block">Chiều ngang (Max Width)</label>
                                                    <select
                                                        value={formData.style?.maxWidth || 'max-w-7xl'}
                                                        onChange={(e) => updateStyle('maxWidth', e.target.value)}
                                                        className="w-full p-2 text-sm border rounded bg-white outline-none focus:border-blue-500"
                                                    >
                                                        <option value="max-w-5xl">Nhỏ (1024px)</option>
                                                        <option value="max-w-7xl">Vừa (1280px)</option>
                                                        <option value="max-w-[1400px]">Lớn (1400px)</option>
                                                        <option value="max-w-full">Full Container</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-600 mb-1 block">Căn lề (Alignment)</label>
                                                    <div className="flex bg-gray-100 p-1 rounded gap-1 border border-gray-200">
                                                        {['text-left', 'text-center', 'text-right'].map((align) => (
                                                            <button
                                                                key={align}
                                                                onClick={() => updateStyle('textAlign', align)}
                                                                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-all ${formData.style?.textAlign === align ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                                title={align}
                                                            >
                                                                {align === 'text-left' && <AlignLeft size={16} />}
                                                                {align === 'text-center' && <AlignCenter size={16} />}
                                                                {align === 'text-right' && <AlignRight size={16} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Carousel Toggle */}
                        <div className="pt-3 border-t border-gray-100">
                            <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div>
                                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <GalleryHorizontal size={16} className="text-blue-500" />
                                        Chế độ Carousel (Slide)
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">Biến các cột thành slide trượt ngang</div>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.enableCarousel || false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, enableCarousel: e.target.checked }))}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>

                            {formData.enableCarousel && (
                                <div className="mt-3 pl-2 border-l-2 border-blue-100 animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-2">Số lượng hiển thị (Desktop)</label>
                                    <select
                                        value={formData.carouselSettings?.slidesPerView || 3}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            carouselSettings: { ...prev.carouselSettings, slidesPerView: parseFloat(e.target.value) }
                                        }))}
                                        className="w-full p-2 text-sm border rounded bg-white"
                                    >
                                        <option value="1">1 Slide / Khung hình</option>
                                        <option value="2">2 Slides / Khung hình</option>
                                        <option value="3">3 Slides / Khung hình</option>
                                        <option value="4">4 Slides / Khung hình</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Appearance Settings */}
                    <section>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Palette size={16} /> Màu sắc & Giao diện
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Màu nền</label>
                                <div className="space-y-3">
                                    {/* Tabs */}
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setColorMode('preset')}
                                            className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${colorMode === 'preset' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Mẫu có sẵn
                                        </button>
                                        <button
                                            onClick={() => {
                                                setColorMode('custom');
                                                updateCustomGradient(customColors, customDir);
                                            }}
                                            className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${colorMode === 'custom' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Tự phối màu
                                        </button>
                                    </div>

                                    {/* Content */}
                                    {colorMode === 'preset' ? (
                                        <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-1">
                                            {BG_OPTIONS.map((bg) => (
                                                <button
                                                    key={bg.value}
                                                    onClick={() => {
                                                        updateStyle('backgroundColor', bg.value);
                                                        updateStyle('textColor', bg.textColor);
                                                        updateStyle('backgroundImage', null);
                                                    }}
                                                    className={`h-10 rounded-md border shadow-sm transition-transform hover:scale-105 ${bg.class} ${formData.style?.backgroundColor === bg.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                                    title={bg.label}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            {/* Colors List */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Màu sắc ({customColors.length})</label>
                                                {customColors.map((color, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center">
                                                        <input
                                                            type="color"
                                                            value={color}
                                                            onChange={(e) => handleColorChange(idx, e.target.value)}
                                                            className="h-8 w-12 rounded cursor-pointer border-0 p-0"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={color}
                                                            onChange={(e) => handleColorChange(idx, e.target.value)}
                                                            className="flex-1 w-full p-1 text-sm border rounded uppercase"
                                                        />
                                                        {customColors.length > 1 && (
                                                            <button onClick={() => handleRemoveColor(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                {customColors.length < 3 && (
                                                    <button onClick={handleAddColor} className="w-full py-1 text-sm text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 flex items-center justify-center gap-1">
                                                        <Plus size={14} /> Thêm màu
                                                    </button>
                                                )}
                                            </div>

                                            {/* Direction */}
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Hướng đổ màu</label>
                                                <div className="grid grid-cols-4 gap-1">
                                                    {[
                                                        { label: 'Right', val: 'to right' },
                                                        { label: 'Bottom', val: 'to bottom' },
                                                        { label: '45°', val: '45deg' },
                                                        { label: '135°', val: '135deg' }
                                                    ].map((dir) => (
                                                        <button
                                                            key={dir.val}
                                                            onClick={() => handleDirChange(dir.val)}
                                                            className={`text-xs p-1 rounded border ${customDir === dir.val ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'}`}
                                                        >
                                                            {dir.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Padding (Khoảng cách dọc)</label>
                                <select
                                    value={formData.style?.padding || 'py-16'}
                                    onChange={(e) => updateStyle('padding', e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="py-8">Nhỏ (py-8)</option>
                                    <option value="py-16">Vừa (py-16)</option>
                                    <option value="py-24">Lớn (py-24)</option>
                                    <option value="py-32">Rất lớn (py-32)</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md font-medium transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={!hasChanges}
                        className={`px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-all ${hasChanges
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:translate-y-px'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            }`}
                    >
                        <Save size={18} /> Lưu thay đổi
                    </button>

                    {/* Save Confirmation Modal */}
                    {showSaveConfirm && (
                        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4 rounded-xl">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
                                <h4 className="font-bold text-gray-800 mb-2 text-lg">Lưu thay đổi Section?</h4>
                                <p className="text-sm text-gray-600 mb-6">Bạn có muốn áp dụng căn lề và định dạng này cho <b>tất cả nội dung</b> bên trong không?</p>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleConfirmSave(true)}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all flex items-start px-4 gap-3 text-left group"
                                    >
                                        <div className="mt-1 p-1 bg-white/20 rounded ring-1 ring-white/30">
                                            <AlignLeft size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Lưu & Đồng bộ tất cả</div>
                                            <div className="text-xs opacity-90 font-normal">Áp dụng cài đặt này cho cả nội dung con</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleConfirmSave(false)}
                                        className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-all flex items-start px-4 gap-3 text-left"
                                    >
                                        <div className="mt-1 p-1 bg-gray-100 rounded ring-1 ring-gray-200 text-gray-500">
                                            <Layout size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">Chỉ lưu vỏ (Container)</div>
                                            <div className="text-xs text-gray-500 font-normal">Giữ nguyên định dạng riêng của nội dung con</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setShowSaveConfirm(false)}
                                        className="w-full py-2 text-gray-400 hover:text-gray-600 font-medium transition-colors text-xs hover:underline mt-1"
                                    >
                                        Hủy bỏ, quay lại
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

// --- Sub-components & Constants ---

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

const BoxedIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M2 12h2M20 12h2" /></svg>
);

const FullWidthIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 12h12" /></svg>
);

const BG_OPTIONS = [
    { value: 'bg-white', label: 'White', class: 'bg-white', textColor: 'text-gray-900' },
    { value: 'bg-gray-50', label: 'Light Gray', class: 'bg-gray-50', textColor: 'text-gray-900' },
    { value: 'bg-blue-50', label: 'Light Blue', class: 'bg-blue-50', textColor: 'text-blue-900' },
    { value: 'bg-slate-900', label: 'Dark Slate', class: 'bg-slate-900', textColor: 'text-white' },
    { value: 'bg-blue-900', label: 'Dark Blue', class: 'bg-blue-900', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-blue-700 to-cyan-500', label: 'Ocean Gradient', class: 'bg-gradient-to-r from-blue-700 to-cyan-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-purple-700 to-indigo-600', label: 'Purple Gradient', class: 'bg-gradient-to-r from-purple-700 to-indigo-600', textColor: 'text-white' },
];

export default SectionSettingsModal;
