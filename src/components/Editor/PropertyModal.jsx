import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { X, Save, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Trash2, Upload, Edit, Info } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const PropertyModal = () => {
    const { selectedComponent, setSelectedComponent, actions, config } = useBuilder();
    const [formData, setFormData] = useState({});

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    useLockBodyScroll(!!selectedComponent);

    useEffect(() => {
        if (selectedComponent) {
            const defaultData = selectedComponent.data || {};
            if (selectedComponent.type === 'RichText') {
                const initData = { ...defaultData };
                if (!initData.contentStyle) initData.contentStyle = { preset: 'body', size: '', bold: false, italic: false, underline: false };
                if (!initData.titleStyle) initData.titleStyle = { preset: 'h2', size: '', bold: true, italic: false, underline: false };
                if (!initData.subtitleStyle) initData.subtitleStyle = { preset: 'h3', size: '', bold: false, italic: false, underline: false };
                setFormData(initData);
            } else if (selectedComponent.type === 'Header') {
                // Ensure menu items have IDs for DnD
                const initData = { ...defaultData };
                if (initData.menuItems) {
                    initData.menuItems = initData.menuItems.map((item, idx) => ({
                        ...item,
                        id: item.id || `menu-${Date.now()}-${idx}`
                    }));
                }
                setFormData(initData);
            } else {
                setFormData(defaultData);
            }
        }
    }, [selectedComponent]);

    if (!selectedComponent) return null;

    const handleSave = () => {
        if (selectedComponent.type === 'Header') {
            actions.updateHeader(formData);
        } else if (selectedComponent.type === 'Footer') {
            actions.updateFooter(formData);
        } else if (selectedComponent.type === 'FooterColumn') {
            const currentFooter = config.footer || {};
            const currentColumns = [...(currentFooter.columns || [])];

            // If strictly updating the column data
            currentColumns[selectedComponent.index] = {
                ...currentColumns[selectedComponent.index],
                data: formData
            };

            actions.updateFooter({
                ...currentFooter,
                columns: currentColumns
            });
        } else {
            actions.updateComponent(
                selectedComponent.sectionId,
                selectedComponent.colIndex,
                selectedComponent.compIndex,
                formData
            );
        }
        setSelectedComponent(null);
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Helper for nested contact info change
    const handleContactChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };



    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.menuItems.findIndex((item) => item.id === active.id);
                const newIndex = prev.menuItems.findIndex((item) => item.id === over.id);
                return {
                    ...prev,
                    menuItems: arrayMove(prev.menuItems, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b flex-none">
                    <h3 className="font-bold text-lg">Chỉnh sửa {selectedComponent.type === 'FooterColumn' ? `Cột Footer: ${selectedComponent.data.type}` : selectedComponent.type}</h3>
                    <button onClick={() => setSelectedComponent(null)} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Helper Config Component */}
                    {(() => {
                        // Footer Column Editor - Universal
                        if (selectedComponent.type === 'FooterColumn') {
                            return (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 mb-4">
                                        Điền thông tin vào các mục bạn muốn hiển thị. Mục nào để trống sẽ được ẩn đi.
                                    </div>

                                    {/* Block 1: Header & Text */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề cột</label>
                                            <input
                                                type="text"
                                                value={formData.title || ''}
                                                onChange={(e) => handleChange('title', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                placeholder="VD: Liên hệ, Về chúng tôi..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung giới thiệu (hỗ trợ xuống dòng)</label>
                                            <textarea
                                                value={formData.content || ''}
                                                onChange={(e) => handleChange('content', e.target.value)}
                                                rows={4}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Mô tả ngắn về công ty..."
                                            />
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    {/* Block 2: Contact Info */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 text-sm uppercase">Thông tin liên hệ</h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                            <input
                                                type="text"
                                                value={formData.address || ''}
                                                onChange={(e) => handleChange('address', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Số nhà, Đường, Quận..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                                <input
                                                    type="text"
                                                    value={formData.phone || ''}
                                                    onChange={(e) => handleChange('phone', e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="text"
                                                    value={formData.email || ''}
                                                    onChange={(e) => handleChange('email', e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Block 3: Navigation Links */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 text-sm uppercase">Danh sách liên kết (Menu)</h4>
                                        {(formData.links || []).map((link, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) => {
                                                        const newLinks = [...formData.links];
                                                        newLinks[idx].label = e.target.value;
                                                        handleChange('links', newLinks);
                                                    }}
                                                    className="w-1/3 p-2 border rounded text-sm"
                                                    placeholder="Tên menu..."
                                                />
                                                <input
                                                    type="text"
                                                    value={link.link}
                                                    onChange={(e) => {
                                                        const newLinks = [...formData.links];
                                                        newLinks[idx].link = e.target.value;
                                                        handleChange('links', newLinks);
                                                    }}
                                                    className="flex-1 p-2 border rounded text-sm"
                                                    placeholder="#..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newLinks = formData.links.filter((_, i) => i !== idx);
                                                        handleChange('links', newLinks);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleChange('links', [...(formData.links || []), { label: 'Link mới', link: '#' }])}
                                            className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            <Plus size={16} /> Thêm liên kết
                                        </button>
                                    </div>

                                    <hr className="border-gray-100" />

                                    {/* Block 4: Social Links */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase">Mạng xã hội</h4>
                                        {(formData.socialLinks || []).map((link, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <select
                                                    value={link.platform}
                                                    onChange={(e) => {
                                                        const newLinks = [...formData.socialLinks];
                                                        newLinks[idx].platform = e.target.value;
                                                        handleChange('socialLinks', newLinks);
                                                    }}
                                                    className="p-2 border rounded w-1/3"
                                                >
                                                    <option value="facebook">Facebook</option>
                                                    <option value="zalo">Zalo</option>
                                                    <option value="youtube">YouTube</option>
                                                    <option value="twitter">Twitter</option>
                                                    <option value="instagram">Instagram</option>
                                                    <option value="linkedin">LinkedIn</option>
                                                    <option value="github">GitHub</option>
                                                    <option value="globe">Website</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const newLinks = [...formData.socialLinks];
                                                        newLinks[idx].url = e.target.value;
                                                        handleChange('socialLinks', newLinks);
                                                    }}
                                                    className="flex-1 p-2 border rounded"
                                                    placeholder="URL..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newLinks = formData.socialLinks.filter((_, i) => i !== idx);
                                                        handleChange('socialLinks', newLinks);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleChange('socialLinks', [...(formData.socialLinks || []), { platform: 'facebook', url: '' }])}
                                            className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            <Plus size={16} /> Thêm mạng xã hội
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Header Editor
                        if (selectedComponent.type === 'Header') {
                            return (
                                <div className="space-y-6">
                                    {/* Branding Section */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Thương hiệu</h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo (URL ảnh)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={formData.logo || ''}
                                                    onChange={(e) => handleChange('logo', e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                                <button className="p-2 border rounded hover:bg-gray-50 text-gray-500" title="Upload (Coming soon)">
                                                    <Upload size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên trang web (Title)</label>
                                            <input
                                                type="text"
                                                value={formData.title || ''}
                                                onChange={(e) => handleChange('title', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                            />
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Menu điều hướng</h4>
                                        <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext
                                                    items={formData.menuItems || []}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {(formData.menuItems || []).map((item, idx) => (
                                                        <SortableItem key={item.id} id={item.id} isEditing={true} className="flex gap-2 items-center bg-white p-2 rounded shadow-sm border border-gray-100 relative pl-8">
                                                            <input
                                                                type="text"
                                                                value={item.label}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.menuItems || [])];
                                                                    newItems[idx].label = e.target.value;
                                                                    handleChange('menuItems', newItems);
                                                                }}
                                                                className="w-1/3 p-2 border rounded text-sm"
                                                                placeholder="Tên menu..."
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.link}
                                                                onChange={(e) => {
                                                                    const newItems = [...(formData.menuItems || [])];
                                                                    newItems[idx].link = e.target.value;
                                                                    handleChange('menuItems', newItems);
                                                                }}
                                                                className="flex-1 p-2 border rounded text-sm"
                                                                placeholder="#..."
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newItems = formData.menuItems.filter((_, i) => i !== idx);
                                                                    handleChange('menuItems', newItems);
                                                                }}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </SortableItem>
                                                    ))}
                                                </SortableContext>
                                            </DndContext>
                                            <button
                                                onClick={() => handleChange('menuItems', [...(formData.menuItems || []), { id: `menu-${Date.now()}`, label: 'Menu Mới', link: '#' }])}
                                                className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> Thêm menu
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Nút hành động (Button)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung nút</label>
                                                <input
                                                    type="text"
                                                    value={formData.actionButtonLabel || 'Contact Us'} // Assuming you add this logic to Header.jsx later if not present
                                                    onChange={(e) => handleChange('actionButtonLabel', e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Link nút</label>
                                                <input
                                                    type="text"
                                                    value={formData.actionButtonLink || '#'}
                                                    onChange={(e) => handleChange('actionButtonLink', e.target.value)}
                                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Style & Colors */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Giao diện</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền</label>
                                                <select
                                                    value={formData.backgroundColor || 'bg-white'}
                                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="bg-white">Trắng</option>
                                                    <option value="bg-gray-50">Xám nhạt</option>
                                                    <option value="bg-slate-900">Tối (Dark)</option>
                                                    <option value="bg-transparent">Trong suốt</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu chữ</label>
                                                <select
                                                    value={formData.textColor || 'text-gray-900'}
                                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="text-gray-900">Đen/Xám đậm</option>
                                                    <option value="text-white">Trắng</option>
                                                    <option value="text-blue-600">Xanh</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh nền (Background Image)</label>
                                            <input
                                                type="text"
                                                value={formData.backgroundImage || ''}
                                                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="https://... (Sẽ đè lên màu nền)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Footer Editor (Main Settings)
                        if (selectedComponent.type === 'Footer') {
                            return (
                                <div className="space-y-6">
                                    {/* Visibility Toggle */}
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <input
                                            type="checkbox"
                                            id="showFooter"
                                            checked={formData.showFooter !== false}
                                            onChange={(e) => handleChange('showFooter', e.target.checked)}
                                            className="w-5 h-5 cursor-pointer accent-blue-600"
                                        />
                                        <label htmlFor="showFooter" className="cursor-pointer font-semibold text-gray-700 select-none">
                                            Hiển thị Footer
                                        </label>
                                    </div>

                                    {/* Column Management */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Quản lý Cột ({formData.columns?.length || 0})</h4>
                                        <div className="space-y-2 mb-3">
                                            {(formData.columns || []).map((col, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white p-2 border rounded shadow-sm">
                                                    <span className="font-medium text-sm truncate max-w-[200px]">
                                                        {col.data?.title || `Cột ${idx + 1}`}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                // Switch to editing this column
                                                                setSelectedComponent({ type: 'FooterColumn', data: col, index: idx });
                                                            }}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Sửa nội dung"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const newCols = [...(formData.columns || [])];
                                                                newCols.splice(idx, 1);
                                                                handleChange('columns', newCols);
                                                            }}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                            title="Xóa cột này"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newCol = {
                                                    type: 'FooterColumn',
                                                    data: { title: 'Cột Mới', content: 'Nội dung...' }
                                                };
                                                handleChange('columns', [...(formData.columns || []), newCol]);
                                            }}
                                            className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> Thêm cột mới
                                        </button>
                                    </div>

                                    {/* Copyright Text */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dòng bản quyền (Copyright)</label>
                                        <input
                                            type="text"
                                            value={formData.copyrightText || ''}
                                            onChange={(e) => handleChange('copyrightText', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="© 2026..."
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Màu sắc</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền (Class CSS)</label>
                                                <select
                                                    value={formData.backgroundColor || 'bg-slate-900'}
                                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="bg-slate-900">Slate 900 (Dark)</option>
                                                    <option value="bg-gray-900">Gray 900</option>
                                                    <option value="bg-blue-900">Blue 900</option>
                                                    <option value="bg-black">Black</option>
                                                    <option value="bg-white">White</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu chữ (Class CSS)</label>
                                                <select
                                                    value={formData.textColor || 'text-white'}
                                                    onChange={(e) => handleChange('textColor', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="text-white">White</option>
                                                    <option value="text-gray-200">Gray 200</option>
                                                    <option value="text-gray-900">Dark (for light bg)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (selectedComponent.type === 'RichText') {
                            const renderStyleToolbar = (key, presetOptions) => {
                                const currentStyle = formData[key] || {};
                                const updateStyle = (prop, value) => {
                                    handleChange(key, { ...currentStyle, [prop]: value });
                                };

                                return (
                                    <div className="flex items-center gap-2 mt-2 p-1 bg-gray-50 rounded border border-gray-200 w-max">
                                        {/* Size / Preset */}
                                        <select
                                            value={currentStyle.preset || presetOptions[0].value}
                                            onChange={(e) => updateStyle('preset', e.target.value)}
                                            className="p-1 text-xs border rounded bg-white outline-none cursor-pointer"
                                        >
                                            {presetOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>

                                        <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>

                                        {/* Bold */}
                                        <button
                                            onClick={() => updateStyle('bold', !currentStyle.bold)}
                                            className={`p-1 rounded w-6 h-6 flex items-center justify-center font-bold text-xs ${currentStyle.bold ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-white'}`}
                                            title="In đậm"
                                        >
                                            B
                                        </button>

                                        {/* Italic */}
                                        <button
                                            onClick={() => updateStyle('italic', !currentStyle.italic)}
                                            className={`p-1 rounded w-6 h-6 flex items-center justify-center italic text-xs font-serif ${currentStyle.italic ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-white'}`}
                                            title="In nghiêng"
                                        >
                                            I
                                        </button>

                                        {/* Underline */}
                                        <button
                                            onClick={() => updateStyle('underline', !currentStyle.underline)}
                                            className={`p-1 rounded w-6 h-6 flex items-center justify-center underline text-xs ${currentStyle.underline ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-white'}`}
                                            title="Gạch chân"
                                        >
                                            U
                                        </button>
                                    </div>
                                );
                            };

                            return (
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                                            placeholder="Nhập tiêu đề..."
                                        />
                                        {renderStyleToolbar('titleStyle', [
                                            { value: 'h1', label: 'Heading 1 (Lớn)' },
                                            { value: 'h2', label: 'Heading 2 (Vừa)' },
                                            { value: 'h3', label: 'Heading 3 (Nhỏ)' }
                                        ])}
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                                        <input
                                            type="text"
                                            value={formData.subtitle || ''}
                                            onChange={(e) => handleChange('subtitle', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Nhập phụ đề..."
                                        />
                                        {renderStyleToolbar('subtitleStyle', [
                                            { value: 'h3', label: 'Chữ lớn' },
                                            { value: 'body', label: 'Chữ thường' },
                                            { value: 'caption', label: 'Chữ nhỏ' }
                                        ])}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                        <textarea
                                            value={formData.content || ''}
                                            onChange={(e) => handleChange('content', e.target.value)}
                                            rows={5}
                                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-base"
                                            placeholder="Nhập nội dung văn bản..."
                                        />
                                        {renderStyleToolbar('contentStyle', [
                                            { value: 'body', label: 'Văn bản thường' },
                                            { value: 'caption', label: 'Ghi chú nhỏ' },
                                            { value: 'h3', label: 'Chữ lớn (Intro)' }
                                        ])}
                                    </div>

                                    {/* Alignment */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Căn lề chung</label>
                                        <div className="flex bg-gray-100 p-1 rounded-lg gap-1 border border-gray-200 w-max">
                                            {['text-left', 'text-center', 'text-right', 'text-justify'].map(align => (
                                                <button
                                                    key={align}
                                                    onClick={() => handleChange('align', formData.align === align ? '' : align)}
                                                    className={`p-2 rounded ${formData.align === align ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    {align === 'text-left' && <AlignLeft size={20} />}
                                                    {align === 'text-center' && <AlignCenter size={20} />}
                                                    {align === 'text-right' && <AlignRight size={20} />}
                                                    {align === 'text-justify' && <AlignJustify size={20} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Link */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gắn Link (URL)</label>
                                        <input
                                            type="text"
                                            value={formData.link || ''}
                                            onChange={(e) => handleChange('link', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
                                            placeholder="https://example.com"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Khi bấm vào nội dung sẽ chuyển đến link này.</p>
                                    </div>
                                </div>
                            );
                        }

                        // Stats Component Logic
                        if (selectedComponent.type === 'Stats') {
                            const items = formData.items || [];

                            const handleItemChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            const handleAddItem = () => {
                                handleChange('items', [...items, { value: '100', label: 'New Stat', link: '' }]);
                            };

                            const handleRemoveItem = (index) => {
                                const newItems = items.filter((_, i) => i !== index);
                                handleChange('items', newItems);
                            };

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Danh sách số liệu</h4>
                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <label className="text-xs text-gray-500 uppercase font-bold">Con số</label>
                                                        <input
                                                            type="text"
                                                            value={item.value}
                                                            onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                                                            className="w-full p-2 border rounded bg-white font-bold"
                                                            placeholder="VD: 100+"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs text-gray-500 uppercase font-bold">Nhãn (Label)</label>
                                                        <input
                                                            type="text"
                                                            value={item.label}
                                                            onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                                                            className="w-full p-2 border rounded bg-white text-sm"
                                                            placeholder="VD: Dự án"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase font-bold">Link (URL)</label>
                                                    <input
                                                        type="text"
                                                        value={item.link || ''}
                                                        onChange={(e) => handleItemChange(index, 'link', e.target.value)}
                                                        className="w-full p-2 border rounded bg-white text-sm"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase font-bold">Mô tả ngắn</label>
                                                    <textarea
                                                        value={item.description || ''}
                                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                        rows={2}
                                                        className="w-full p-2 border rounded bg-white text-sm"
                                                        placeholder="Mô tả bổ sung cho số liệu..."
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded self-center transition-colors"
                                                title="Xóa mục này"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleAddItem}
                                        className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus size={18} /> Thêm số liệu mới
                                    </button>

                                    <div className="pt-4 border-t border-gray-100">
                                        <h4 className="font-semibold text-gray-700 mb-3">Màu sắc & Giao diện</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Màu nền', key: 'backgroundColor', default: '#fffbeb70' },
                                                { label: 'Màu viền', key: 'borderColor', default: '#fef08a' },
                                                { label: 'Màu số', key: 'valueColor', default: '#ca8a04' },
                                                { label: 'Màu chữ', key: 'labelColor', default: '#6b7280' },
                                            ].map((colorOpt) => (
                                                <div key={colorOpt.key}>
                                                    <label className="text-xs text-gray-500 uppercase font-bold block mb-1">{colorOpt.label}</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={formData.styles?.[colorOpt.key] || colorOpt.default}
                                                            onChange={(e) => {
                                                                const newStyles = { ...formData.styles, [colorOpt.key]: e.target.value };
                                                                handleChange('styles', newStyles);
                                                            }}
                                                            className="h-9 w-9 p-0 border rounded cursor-pointer shrink-0"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={formData.styles?.[colorOpt.key] || colorOpt.default}
                                                            onChange={(e) => {
                                                                const newStyles = { ...formData.styles, [colorOpt.key]: e.target.value };
                                                                handleChange('styles', newStyles);
                                                            }}
                                                            className="w-full p-2 border rounded text-sm uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }


                        // Timeline Editor
                        if (selectedComponent.type === 'Timeline') {
                            const items = formData.items || [];
                            const handleTimelineChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Sự kiện (Timeline Items)</h4>
                                    {items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.date}
                                                    onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                                                    className="w-1/4 p-2 border rounded font-bold"
                                                    placeholder="Năm/Ngày"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                                    className="flex-1 p-2 border rounded font-medium"
                                                    placeholder="Tiêu đề sự kiện"
                                                />
                                            </div>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Mô tả chi tiết..."
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = items.filter((_, i) => i !== index);
                                                    handleChange('items', newItems);
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Xóa sự kiện này
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('items', [...items, { date: 'New', title: 'Event', description: '...' }])}
                                        className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Thêm sự kiện
                                    </button>
                                </div>
                            );
                        }

                        // FAQ Editor
                        if (selectedComponent.type === 'FAQ') {
                            const items = formData.items || [];
                            const handleFaqChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Câu hỏi (FAQ Items)</h4>
                                    {items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <input
                                                type="text"
                                                value={item.question}
                                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                className="w-full p-2 border rounded font-bold"
                                                placeholder="Câu hỏi?"
                                            />
                                            <textarea
                                                value={item.answer}
                                                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Câu trả lời..."
                                                rows={3}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = items.filter((_, i) => i !== index);
                                                    handleChange('items', newItems);
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Xóa câu hỏi này
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('items', [...items, { question: 'Câu hỏi mới?', answer: 'Trả lời...' }])}
                                        className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Thêm câu hỏi
                                    </button>
                                </div>
                            );
                        }

                        // Steps Editor
                        if (selectedComponent.type === 'Steps') {
                            const items = formData.items || [];
                            const handleStepsChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Các bước thực hiện (Steps)</h4>
                                    {items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.step}
                                                    onChange={(e) => handleStepsChange(index, 'step', e.target.value)}
                                                    className="w-16 p-2 border rounded font-bold text-center"
                                                    placeholder="01"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleStepsChange(index, 'title', e.target.value)}
                                                    className="flex-1 p-2 border rounded font-bold"
                                                    placeholder="Tên bước"
                                                />
                                            </div>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleStepsChange(index, 'description', e.target.value)}
                                                className="w-full p-2 border rounded text-sm"
                                                placeholder="Mô tả chi tiết..."
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newItems = items.filter((_, i) => i !== index);
                                                    handleChange('items', newItems);
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Xóa bước này
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('items', [...items, { step: '0' + (items.length + 1), title: 'Bước mới', description: '...' }])}
                                        className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Thêm bước
                                    </button>
                                </div>
                            );
                        }

                        // Prize Editor
                        if (selectedComponent.type === 'Prize') {
                            const items = formData.items || [];
                            const handlePrizeChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Danh sách giải thưởng</h4>
                                    {items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 font-bold block mb-1">Tên giải</label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => handlePrizeChange(index, 'title', e.target.value)}
                                                        className="w-full p-2 border rounded font-bold"
                                                        placeholder="VD: Giải nhất"
                                                    />
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="text-xs text-gray-500 font-bold block mb-1">Icon</label>
                                                    <select
                                                        value={item.icon}
                                                        onChange={(e) => handlePrizeChange(index, 'icon', e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                    >
                                                        <option value="award">Award</option>
                                                        <option value="trophy">Trophy</option>
                                                        <option value="star">Star</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 font-bold block mb-1">Giá trị / Mô tả phụ</label>
                                                <input
                                                    type="text"
                                                    value={item.subtitle}
                                                    onChange={(e) => handlePrizeChange(index, 'subtitle', e.target.value)}
                                                    className="w-full p-2 border rounded text-sm"
                                                    placeholder="VD: 500.000 VNĐ"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newItems = items.filter((_, i) => i !== index);
                                                    handleChange('items', newItems);
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Xóa giải này
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleChange('items', [...items, { title: 'Giải mới', subtitle: '...', icon: 'award' }])}
                                        className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Thêm giải thưởng
                                    </button>
                                </div>
                            );
                        }

                        // Media / Image Editor
                        if (selectedComponent.type === 'Media') {
                            return (
                                <div className="space-y-4">
                                    {formData.instruction && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3 group relative cursor-help mb-4">
                                            <Info size={20} className="text-blue-600 shrink-0" />
                                            <div>
                                                <h5 className="text-sm font-bold text-blue-800 mb-1">Hướng dẫn</h5>
                                                <p className="text-sm text-blue-700 leading-relaxed">{formData.instruction}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Đường dẫn ảnh / video (SRC)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.src || ''}
                                                onChange={(e) => handleChange('src', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                placeholder="https://..."
                                            />
                                            <button className="p-2 bg-gray-100 rounded hover:bg-gray-200" title="Tải ảnh lên (Demo)"><Upload size={18} /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Tỷ lệ khung hình</label>
                                            <select
                                                value={formData.aspectRatio || 'aspect-video'}
                                                onChange={(e) => handleChange('aspectRatio', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="aspect-video">16:9 (Video/Banner)</option>
                                                <option value="aspect-[21/9]">21:9 (Ultra Wide)</option>
                                                <option value="aspect-[4/3]">4:3 (Standard)</option>
                                                <option value="aspect-square">1:1 (Square)</option>
                                                <option value="aspect-auto">Tự nhiên (Auto)</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.fullWidth || false}
                                                    onChange={(e) => handleChange('fullWidth', e.target.checked)}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Tràn viền (Full Width)</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả ảnh (Alt)</label>
                                        <input
                                            type="text"
                                            value={formData.alt || ''}
                                            onChange={(e) => handleChange('alt', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Mô tả cho SEO..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Chú thích (Caption)</label>
                                        <input
                                            type="text"
                                            value={formData.caption || ''}
                                            onChange={(e) => handleChange('caption', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Hiển thị dưới ảnh..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Link liên kết</label>
                                        <input
                                            type="text"
                                            value={formData.link || ''}
                                            onChange={(e) => handleChange('link', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            );
                        }

                        return Object.entries(formData).map(([key, value]) => {
                            if (key === 'src' || key === 'alt' || key === 'caption') {
                                return (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                );
                            }
                            // ... other fields handling if needed
                            return null;
                        });
                    })()}
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 flex-none">
                    <button
                        onClick={() => setSelectedComponent(null)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md font-medium"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
                    >
                        <Save size={18} /> Lưu lại
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PropertyModal;
