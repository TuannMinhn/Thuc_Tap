import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { X, Save, Layout, Palette, Monitor, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, Check, GalleryHorizontal, Type, Hash, Maximize2, Square, Layers } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const SectionSettingsModal = () => {
    const { config, setConfig, activeSectionId, setActiveSectionId } = useBuilder();
    const [formData, setFormData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [slideCountInput, setSlideCountInput] = useState('');
    const slideDebounceRef = useRef(null);

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

                    {/* ID Settings */}
                    <section>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Hash size={16} /> Định danh (ID)
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ID Section (Neo)</label>
                            <input
                                type="text"
                                value={formData.anchorId || ''}
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                                    setFormData(prev => ({ ...prev, anchorId: val }));
                                }}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                placeholder="vi-du-gioi-thieu"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Dùng để tạo menu cuộn trang. Ví dụ đặt ID là <b>gioi-thieu</b>, thì khi vào Menu gán link là <b>#gioi-thieu</b>.
                            </p>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Layout Settings */}
                    <section>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Layout size={16} /> Bố cục & Cột
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng cột ({formData.columns.length})</label>
                                {!formData.enableCarousel ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-blue-800">Số lượng Slides</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={slideCountInput}
                                                onFocus={() => setSlideCountInput(String(formData.columns.length))}
                                                onChange={(e) => {
                                                    const inputVal = e.target.value.replace(/\D/g, '');
                                                    setSlideCountInput(inputVal);

                                                    if (slideDebounceRef.current) clearTimeout(slideDebounceRef.current);
                                                    slideDebounceRef.current = setTimeout(() => {
                                                        const val = parseInt(inputVal) || 1;
                                                        if (val >= 1 && val <= 100) {
                                                            updateColumns(val);
                                                        }
                                                    }, 600);
                                                }}
                                                onBlur={() => {
                                                    if (slideDebounceRef.current) clearTimeout(slideDebounceRef.current);
                                                    const val = parseInt(slideCountInput) || 1;
                                                    if (val >= 1 && val <= 100) updateColumns(val);
                                                    setSlideCountInput(String(formData.columns.length));
                                                }}
                                                placeholder={String(formData.columns.length)}
                                                className="w-20 p-2 text-sm border border-blue-300 rounded-lg text-center bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                            />
                                        </div>
                                        <p className="text-xs text-blue-600">
                                            Nhập số và chờ 0.6 giây hoặc click ra ngoài để áp dụng.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Carousel Toggle */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <GalleryHorizontal size={20} className="text-gray-500" />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-700">Chế độ Carousel</span>
                                        <span className="block text-xs text-gray-500">Hiển thị nội dung dạng trượt ngang</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.enableCarousel || false}
                                        onChange={(e) => setFormData(prev => ({ ...prev, enableCarousel: e.target.checked }))}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Carousel Settings */}
                            {formData.enableCarousel && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Cấu hình Carousel</label>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Số lượng hiển thị (Slides Per View)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="1"
                                                max="6"
                                                step="0.5"
                                                value={formData.carouselSettings?.slidesPerView || 3}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    carouselSettings: {
                                                        ...prev.carouselSettings,
                                                        slidesPerView: parseFloat(e.target.value)
                                                    }
                                                }))}
                                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <span className="text-sm font-bold text-blue-600 w-8 text-center">
                                                {formData.carouselSettings?.slidesPerView || 3}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

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


                    </section>

                    <hr className="border-gray-100" />

                    {/* Border & Shadow */}
                    <section>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Square size={16} /> Viền & Đổ bóng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bo góc (Border Radius)</label>
                                <select
                                    value={formData.style?.borderRadius || 'rounded-none'}
                                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="rounded-none">Không (0)</option>
                                    <option value="rounded-lg">Nhỏ (8px)</option>
                                    <option value="rounded-xl">Vừa (12px)</option>
                                    <option value="rounded-2xl">Lớn (16px)</option>
                                    <option value="rounded-3xl">Rất lớn (24px)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Viền (Border)</label>
                                <select
                                    value={formData.style?.border || 'border-none'}
                                    onChange={(e) => updateStyle('border', e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="border-none">Không viền</option>
                                    <option value="border border-gray-200">Mỏng - Xám nhạt</option>
                                    <option value="border border-gray-300">Mỏng - Xám</option>
                                    <option value="border-2 border-gray-200">Dày - Xám nhạt</option>
                                    <option value="border-2 border-blue-500">Dày - Xanh</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Đổ bóng (Shadow)</label>
                                <select
                                    value={formData.style?.shadow || 'shadow-none'}
                                    onChange={(e) => updateStyle('shadow', e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="shadow-none">Không bóng</option>
                                    <option value="shadow-sm">Nhỏ</option>
                                    <option value="shadow-md">Vừa</option>
                                    <option value="shadow-lg">Lớn</option>
                                    <option value="shadow-xl">Rất lớn</option>
                                    <option value="shadow-2xl">Cực lớn</option>
                                </select>
                            </div>
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
                                        <div className="grid grid-cols-6 gap-2 animate-in fade-in slide-in-from-top-1 max-h-64 overflow-y-auto p-1">
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
    // Màu trắng & xám
    { value: 'bg-white', label: 'White', class: 'bg-white', textColor: 'text-gray-900' },
    { value: 'bg-gray-50', label: 'Light Gray', class: 'bg-gray-50', textColor: 'text-gray-900' },
    { value: 'bg-gray-100', label: 'Gray 100', class: 'bg-gray-100', textColor: 'text-gray-900' },
    { value: 'bg-gray-200', label: 'Gray 200', class: 'bg-gray-200', textColor: 'text-gray-900' },
    { value: 'bg-gray-800', label: 'Dark Gray', class: 'bg-gray-800', textColor: 'text-white' },
    { value: 'bg-gray-900', label: 'Gray 900', class: 'bg-gray-900', textColor: 'text-white' },
    { value: 'bg-slate-900', label: 'Dark Slate', class: 'bg-slate-900', textColor: 'text-white' },
    { value: 'bg-black', label: 'Black', class: 'bg-black', textColor: 'text-white' },
    
    // Màu xanh dương (Blue)
    { value: 'bg-blue-50', label: 'Light Blue', class: 'bg-blue-50', textColor: 'text-blue-900' },
    { value: 'bg-blue-100', label: 'Blue 100', class: 'bg-blue-100', textColor: 'text-blue-900' },
    { value: 'bg-blue-500', label: 'Blue 500', class: 'bg-blue-500', textColor: 'text-white' },
    { value: 'bg-blue-600', label: 'Blue 600', class: 'bg-blue-600', textColor: 'text-white' },
    { value: 'bg-blue-700', label: 'Blue 700', class: 'bg-blue-700', textColor: 'text-white' },
    { value: 'bg-blue-900', label: 'Dark Blue', class: 'bg-blue-900', textColor: 'text-white' },
    
    // Màu xanh lá (Green)
    { value: 'bg-green-50', label: 'Light Green', class: 'bg-green-50', textColor: 'text-green-900' },
    { value: 'bg-green-100', label: 'Green 100', class: 'bg-green-100', textColor: 'text-green-900' },
    { value: 'bg-green-500', label: 'Green 500', class: 'bg-green-500', textColor: 'text-white' },
    { value: 'bg-green-600', label: 'Green 600', class: 'bg-green-600', textColor: 'text-white' },
    { value: 'bg-green-700', label: 'Green 700', class: 'bg-green-700', textColor: 'text-white' },
    
    // Màu đỏ (Red)
    { value: 'bg-red-50', label: 'Light Red', class: 'bg-red-50', textColor: 'text-red-900' },
    { value: 'bg-red-100', label: 'Red 100', class: 'bg-red-100', textColor: 'text-red-900' },
    { value: 'bg-red-500', label: 'Red 500', class: 'bg-red-500', textColor: 'text-white' },
    { value: 'bg-red-600', label: 'Red 600', class: 'bg-red-600', textColor: 'text-white' },
    { value: 'bg-red-700', label: 'Red 700', class: 'bg-red-700', textColor: 'text-white' },
    
    // Màu vàng (Yellow)
    { value: 'bg-yellow-50', label: 'Light Yellow', class: 'bg-yellow-50', textColor: 'text-yellow-900' },
    { value: 'bg-yellow-100', label: 'Yellow 100', class: 'bg-yellow-100', textColor: 'text-yellow-900' },
    { value: 'bg-yellow-400', label: 'Yellow 400', class: 'bg-yellow-400', textColor: 'text-yellow-900' },
    { value: 'bg-yellow-500', label: 'Yellow 500', class: 'bg-yellow-500', textColor: 'text-yellow-900' },
    
    // Màu cam (Orange)
    { value: 'bg-orange-50', label: 'Light Orange', class: 'bg-orange-50', textColor: 'text-orange-900' },
    { value: 'bg-orange-100', label: 'Orange 100', class: 'bg-orange-100', textColor: 'text-orange-900' },
    { value: 'bg-orange-500', label: 'Orange 500', class: 'bg-orange-500', textColor: 'text-white' },
    { value: 'bg-orange-600', label: 'Orange 600', class: 'bg-orange-600', textColor: 'text-white' },
    
    // Màu tím (Purple)
    { value: 'bg-purple-50', label: 'Light Purple', class: 'bg-purple-50', textColor: 'text-purple-900' },
    { value: 'bg-purple-100', label: 'Purple 100', class: 'bg-purple-100', textColor: 'text-purple-900' },
    { value: 'bg-purple-500', label: 'Purple 500', class: 'bg-purple-500', textColor: 'text-white' },
    { value: 'bg-purple-600', label: 'Purple 600', class: 'bg-purple-600', textColor: 'text-white' },
    { value: 'bg-purple-700', label: 'Purple 700', class: 'bg-purple-700', textColor: 'text-white' },
    
    // Màu hồng (Pink)
    { value: 'bg-pink-50', label: 'Light Pink', class: 'bg-pink-50', textColor: 'text-pink-900' },
    { value: 'bg-pink-100', label: 'Pink 100', class: 'bg-pink-100', textColor: 'text-pink-900' },
    { value: 'bg-pink-500', label: 'Pink 500', class: 'bg-pink-500', textColor: 'text-white' },
    { value: 'bg-pink-600', label: 'Pink 600', class: 'bg-pink-600', textColor: 'text-white' },
    
    // Màu xanh lơ (Cyan/Teal)
    { value: 'bg-cyan-50', label: 'Light Cyan', class: 'bg-cyan-50', textColor: 'text-cyan-900' },
    { value: 'bg-cyan-100', label: 'Cyan 100', class: 'bg-cyan-100', textColor: 'text-cyan-900' },
    { value: 'bg-cyan-500', label: 'Cyan 500', class: 'bg-cyan-500', textColor: 'text-white' },
    { value: 'bg-cyan-600', label: 'Cyan 600', class: 'bg-cyan-600', textColor: 'text-white' },
    { value: 'bg-teal-500', label: 'Teal 500', class: 'bg-teal-500', textColor: 'text-white' },
    { value: 'bg-teal-600', label: 'Teal 600', class: 'bg-teal-600', textColor: 'text-white' },
    
    // Màu chàm (Indigo)
    { value: 'bg-indigo-50', label: 'Light Indigo', class: 'bg-indigo-50', textColor: 'text-indigo-900' },
    { value: 'bg-indigo-100', label: 'Indigo 100', class: 'bg-indigo-100', textColor: 'text-indigo-900' },
    { value: 'bg-indigo-500', label: 'Indigo 500', class: 'bg-indigo-500', textColor: 'text-white' },
    { value: 'bg-indigo-600', label: 'Indigo 600', class: 'bg-indigo-600', textColor: 'text-white' },
    
    // Gradient (Màu chuyển sắc)
    { value: 'bg-gradient-to-r from-blue-700 to-cyan-500', label: 'Ocean Gradient', class: 'bg-gradient-to-r from-blue-700 to-cyan-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-purple-700 to-indigo-600', label: 'Purple Gradient', class: 'bg-gradient-to-r from-purple-700 to-indigo-600', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-pink-500 to-rose-500', label: 'Pink Gradient', class: 'bg-gradient-to-r from-pink-500 to-rose-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-green-400 to-blue-500', label: 'Green-Blue Gradient', class: 'bg-gradient-to-r from-green-400 to-blue-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-yellow-400 to-orange-500', label: 'Sunset Gradient', class: 'bg-gradient-to-r from-yellow-400 to-orange-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-red-500 to-pink-500', label: 'Red-Pink Gradient', class: 'bg-gradient-to-r from-red-500 to-pink-500', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-indigo-500 to-purple-600', label: 'Indigo-Purple Gradient', class: 'bg-gradient-to-r from-indigo-500 to-purple-600', textColor: 'text-white' },
    { value: 'bg-gradient-to-r from-gray-700 to-gray-900', label: 'Dark Gradient', class: 'bg-gradient-to-r from-gray-700 to-gray-900', textColor: 'text-white' },
];

export default SectionSettingsModal;
