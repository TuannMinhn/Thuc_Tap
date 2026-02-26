import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { X, Save, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, Trash2, Upload, Edit, Info, LayoutTemplate } from 'lucide-react';
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

    const fileInputRef = React.useRef(null);

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

    // File Upload Handler (Moved to top level)
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('src', reader.result);
            };
            reader.readAsDataURL(file);
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
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="header-logo-upload"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                handleChange('logo', reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('header-logo-upload').click()}
                                                    className="p-2 border rounded hover:bg-blue-50 text-blue-600 hover:border-blue-300 transition-colors"
                                                    title="Tải ảnh lên"
                                                >
                                                    <Upload size={20} />
                                                </button>
                                            </div>
                                            {formData.logo && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <img
                                                        src={formData.logo}
                                                        alt="Logo preview"
                                                        className="h-10 max-w-[120px] object-contain border rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('logo', '')}
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                    >
                                                        Xóa logo
                                                    </button>
                                                </div>
                                            )}
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

                                        {/* Layout Selection */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu Header</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleChange('layout', 'standard')}
                                                    className={`p-3 border rounded-lg text-sm font-medium flex flex-col items-center gap-2 transition-all ${(formData.layout || 'standard') === 'standard'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                        }`}
                                                >
                                                    <LayoutTemplate size={20} />
                                                    Mặc định (Full)
                                                </button>
                                                <button
                                                    onClick={() => handleChange('layout', 'floating')}
                                                    className={`p-3 border rounded-lg text-sm font-medium flex flex-col items-center gap-2 transition-all ${formData.layout === 'floating'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                        }`}
                                                >
                                                    <div className="w-8 h-4 border-2 border-current rounded-full"></div>
                                                    Nổi (Pill)
                                                </button>
                                            </div>
                                        </div>

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

                                        <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>

                                        {/* Color Picker */}
                                        <div className="relative group/color">
                                            <input
                                                type="color"
                                                value={currentStyle.color || '#000000'}
                                                onChange={(e) => updateStyle('color', e.target.value)}
                                                className="w-6 h-6 p-0 border-none rounded overflow-hidden cursor-pointer"
                                                title="Màu chữ"
                                            />
                                        </div>
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

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
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

                                    {/* Background Color Config (Container) */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung (Container):</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền khung"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }


                        // Timeline Editor
                        if (selectedComponent.type === 'Timeline') {
                            const items = formData.items || [];
                            const templateItem = items.length > 0 ? items[0] : { date: '2024', title: 'Tiêu đề', description: 'Mô tả' };

                            // Define field mappings for UI
                            const FIELD_CONFIG = {
                                year: { label: 'Năm', placeholder: '2024', width: 'w-1/4' },
                                step: { label: 'Bước', placeholder: 'Bước 1', width: 'w-1/4' },
                                phase: { label: 'Giai đoạn', placeholder: 'Giai đoạn 1', width: 'w-1/3' },
                                date: { label: 'Thời gian', placeholder: 'dd/mm/yyyy', width: 'w-1/4' },

                                title: { label: 'Tiêu đề', placeholder: 'Tiêu đề chính...', width: 'flex-1' },
                                action: { label: 'Hành động', placeholder: 'Hành động...', width: 'flex-1' },

                                description: { label: 'Mô tả', placeholder: 'Mô tả chi tiết...', type: 'textarea' },
                                goal: { label: 'Mục tiêu / Kết quả', placeholder: 'Mục tiêu cần đạt...', type: 'textarea' },
                                status: { label: 'Trạng thái / Kết quả', placeholder: 'Trạng thái hiện tại...', type: 'textarea' },
                                image: { label: 'Ảnh minh họa', placeholder: 'https://...', width: 'full' }
                            };

                            const handleTimelineChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };
                                handleChange('items', newItems);
                            };

                            // Determine active fields based on template item
                            const activeFields = [...Object.keys(templateItem).filter(key => FIELD_CONFIG[key]), 'image']; // Always include image option

                            return (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-700">Sự kiện (Timeline Items)</h4>
                                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-2">
                                        * Form tự động điều chỉnh theo mẫu bạn chọn (Năm, Bước, hoặc Giai đoạn).
                                    </div>

                                    {items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                            {/* Top Row: Badge + Title */}
                                            <div className="flex gap-2">
                                                {activeFields.filter(k => ['year', 'step', 'phase', 'date'].includes(k)).map(key => (
                                                    <div key={key} className={FIELD_CONFIG[key].width}>
                                                        <input
                                                            type="text"
                                                            value={item[key] || ''}
                                                            onChange={(e) => handleTimelineChange(index, key, e.target.value)}
                                                            className="w-full p-2 border rounded font-bold"
                                                            placeholder={FIELD_CONFIG[key].placeholder}
                                                            title={FIELD_CONFIG[key].label}
                                                        />
                                                    </div>
                                                ))}

                                                {activeFields.filter(k => ['title', 'action'].includes(k)).map(key => (
                                                    <div key={key} className={FIELD_CONFIG[key].width}>
                                                        <input
                                                            type="text"
                                                            value={item[key] || ''}
                                                            onChange={(e) => handleTimelineChange(index, key, e.target.value)}
                                                            className="w-full p-2 border rounded font-bold"
                                                            placeholder={FIELD_CONFIG[key].placeholder}
                                                            title={FIELD_CONFIG[key].label}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bottom Row: Description */}
                                            {activeFields.filter(k => ['description', 'goal', 'status'].includes(k)).map(key => (
                                                <textarea
                                                    key={key}
                                                    value={item[key] || ''}
                                                    onChange={(e) => handleTimelineChange(index, key, e.target.value)}
                                                    className="w-full p-2 border rounded text-sm"
                                                    placeholder={FIELD_CONFIG[key].placeholder}
                                                    rows={2}
                                                    title={FIELD_CONFIG[key].label}
                                                />
                                            ))}

                                            {/* Image Input */}
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={item.image || ''}
                                                    onChange={(e) => handleTimelineChange(index, 'image', e.target.value)}
                                                    className="flex-1 p-2 border rounded text-sm"
                                                    placeholder="Link ảnh minh họa (http://...)"
                                                />
                                                <input
                                                    type="file"
                                                    id={`timeline-image-${index}`}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                handleTimelineChange(index, 'image', reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => document.getElementById(`timeline-image-${index}`).click()}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                    title="Tải ảnh lên"
                                                >
                                                    <Upload size={16} />
                                                </button>
                                                {item.image && (
                                                    <img src={item.image} alt="Preview" className="w-8 h-8 rounded object-cover border" />
                                                )}
                                            </div>

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
                                        onClick={() => {
                                            // Clone structure from first item but clear values
                                            const newItem = {};
                                            activeFields.forEach(k => newItem[k] = '');
                                            // Set default values for badge
                                            if (newItem.year !== undefined) newItem.year = '202X';
                                            if (newItem.step !== undefined) newItem.step = `Bước ${items.length + 1}`;

                                            handleChange('items', [...items, newItem]);
                                        }}
                                        className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Thêm sự kiện
                                    </button>

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
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

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
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

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Prize Editor
                        if (selectedComponent.type === 'Prize') {
                            const items = formData.items || [];

                            // Currency options
                            const currencyOptions = [
                                { code: 'VNĐ', symbol: '₫', locale: 'vi-VN' },
                                { code: 'USD', symbol: '$', locale: 'en-US' },
                                { code: 'EUR', symbol: '€', locale: 'de-DE' },
                                { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
                                { code: 'KRW', symbol: '₩', locale: 'ko-KR' },
                                { code: 'GBP', symbol: '£', locale: 'en-GB' },
                                { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
                            ];

                            // Format number with thousand separators
                            const formatNumber = (num, locale = 'vi-VN') => {
                                if (!num) return '';
                                return new Intl.NumberFormat(locale).format(num);
                            };

                            // Parse number from formatted string
                            const parseNumber = (str) => {
                                if (!str) return '';
                                return str.replace(/[^\d]/g, '');
                            };

                            // Combine amount and currency into formatted value with SMART FORMATTING
                            const combineValue = (amount, currency) => {
                                if (!amount) return '';

                                // Smart formatting for VNĐ
                                if (currency === 'VNĐ') {
                                    const num = parseFloat(amount);
                                    if (num >= 1000000000) {
                                        const value = (num / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                                        return `${value} Tỷ VNĐ`;
                                    } else if (num >= 1000000) {
                                        const value = (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
                                        return `${value} Triệu VNĐ`;
                                    }
                                }

                                const currencyInfo = currencyOptions.find(c => c.code === currency) || currencyOptions[0];
                                const formattedAmount = formatNumber(amount, currencyInfo.locale);
                                return `${formattedAmount} ${currency}`;
                            };

                            // Handle prize field changes
                            const handlePrizeChange = (index, field, value) => {
                                const newItems = [...items];
                                newItems[index] = { ...newItems[index], [field]: value };

                                // Auto-combine amount + currency into value
                                if (field === 'amount' || field === 'currency') {
                                    const amount = field === 'amount' ? value : newItems[index].amount;
                                    const currency = field === 'currency' ? value : (newItems[index].currency || 'VNĐ');
                                    newItems[index].value = combineValue(amount, currency);
                                }

                                handleChange('items', newItems);
                            };

                            // Extract amount from existing value
                            const extractAmount = (value) => {
                                if (!value) return '';
                                let multiplier = 1;
                                if (value.match(/Tỷ/i)) multiplier = 1000000000;
                                else if (value.match(/Triệu/i)) multiplier = 1000000;
                                else if (value.match(/Nghìn/i)) multiplier = 1000;

                                let cleanStr = value.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(/,/g, '.');
                                const num = parseFloat(cleanStr);
                                if (isNaN(num)) return parseNumber(value);
                                return Math.round(num * multiplier).toString();
                            };

                            // Extract currency from existing value
                            const extractCurrency = (value) => {
                                if (!value) return 'VNĐ';
                                const match = value.match(/(VNĐ|USD|EUR|JPY|KRW|GBP|CNY)/i);
                                return match ? match[1].toUpperCase() : 'VNĐ';
                            };

                            const updateLayout = (key, val) => handleChange(key, val);

                            return (
                                <div className="space-y-6">
                                    {/* Layout Settings Section */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                                        <h4 className="font-bold text-blue-800 flex items-center gap-2">
                                            <LayoutTemplate size={18} /> Cấu trúc hiển thị
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => updateLayout('layout', 'vertical')}
                                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${(!formData.layout || formData.layout === 'vertical') ? 'bg-white border-blue-500 shadow-md text-blue-600' : 'bg-white/50 border-gray-200 hover:bg-white text-gray-500'}`}
                                            >
                                                <div className="w-8 h-10 border-2 border-current rounded border-dashed flex flex-col gap-1 p-1">
                                                    <div className="w-full h-1 bg-current rounded-full" />
                                                    <div className="w-full h-1 bg-current rounded-full" />
                                                    <div className="w-full h-1 bg-current rounded-full" />
                                                </div>
                                                <span className="text-sm font-medium">Dọc (Mặc định)</span>
                                            </button>
                                            <button
                                                onClick={() => updateLayout('layout', 'horizontal')}
                                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${(formData.layout === 'horizontal') ? 'bg-white border-blue-500 shadow-md text-blue-600' : 'bg-white/50 border-gray-200 hover:bg-white text-gray-500'}`}
                                            >
                                                <div className="w-10 h-8 border-2 border-current rounded border-dashed flex gap-1 p-1">
                                                    <div className="w-1/3 h-full bg-current rounded" />
                                                    <div className="w-2/3 h-full flex flex-col gap-1">
                                                        <div className="w-full h-0.5 bg-current rounded-full" />
                                                        <div className="w-full h-0.5 bg-current rounded-full" />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">Ngang (Tiêu đề trái)</span>
                                            </button>
                                        </div>
                                        {formData.layout === 'horizontal' && (
                                            <div className="animate-in fade-in slide-in-from-top-2 border-t pt-3 mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="block text-sm font-medium text-gray-700">Tiêu đề lớn bên trái</label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={formData.blockTitle || 'Giải thưởng'}
                                                        onChange={(e) => updateLayout('blockTitle', e.target.value)}
                                                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                        placeholder="VD: Giải thưởng"
                                                    />
                                                    <div className="relative w-24">
                                                        <input
                                                            type="number"
                                                            value={formData.blockTitleSize || 36}
                                                            onChange={(e) => updateLayout('blockTitleSize', e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                            placeholder="Size"
                                                            title="Kích thước chữ (px)"
                                                        />
                                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">px</span>
                                                    </div>
                                                    <div className="relative group/color" title="Màu chữ">
                                                        <input
                                                            type="color"
                                                            value={formData.blockTitleColor || '#eab308'}
                                                            onChange={(e) => updateLayout('blockTitleColor', e.target.value)}
                                                            className="w-10 h-10 p-1 border rounded-lg cursor-pointer bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Background Color Config */}
                                        <div className="flex items-center gap-3 pt-2 border-t border-blue-200 mt-2">
                                            <span className="text-sm font-medium text-blue-800">Màu nền khung:</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={formData.backgroundColor || '#ffffff'}
                                                    onChange={(e) => updateLayout('backgroundColor', e.target.value)}
                                                    className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                    title="Chọn màu nền"
                                                />
                                                {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                                {formData.backgroundColor && (
                                                    <button
                                                        onClick={() => updateLayout('backgroundColor', '')}
                                                        className="text-xs text-red-500 hover:underline"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-gray-700">Danh sách giải thưởng</h4>
                                            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                                                <Info size={14} /> Tip: Nhập số tiền cụ thể để dùng tính năng thông minh
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {items.map((item, index) => (
                                                <div key={index} className="border rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-colors relative group/item">
                                                    <div className="flex gap-3">
                                                        <div className="flex-1">
                                                            <label className="text-xs text-gray-500 font-bold block mb-1">Tên giải</label>
                                                            <input type="text" value={item.title || ''} onChange={(e) => handlePrizeChange(index, 'title', e.target.value)} className="w-full p-2 border rounded font-bold" placeholder="VD: Giải nhất" />
                                                        </div>
                                                        <div className="w-2/5">
                                                            <label className="text-xs text-gray-500 font-bold block mb-1">Giá trị</label>
                                                            <div className="flex gap-1">
                                                                <input type="text" value={item.amount || extractAmount(item.value)} onChange={(e) => handlePrizeChange(index, 'amount', parseNumber(e.target.value))} className="flex-1 p-2 border rounded text-sm text-right" placeholder="3000000" />
                                                                <select value={item.currency || extractCurrency(item.value)} onChange={(e) => handlePrizeChange(index, 'currency', e.target.value)} className="w-20 p-2 border rounded text-sm bg-white">
                                                                    {currencyOptions.map(c => (<option key={c.code} value={c.code}>{c.code}</option>))}
                                                                </select>
                                                            </div>
                                                            {(item.amount || extractAmount(item.value)) && (
                                                                <div className="text-xs text-gray-400 mt-1 text-right">→ {item.value || combineValue(extractAmount(item.value), extractCurrency(item.value))}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-bold block mb-1">Mô tả</label>
                                                        <input type="text" value={item.description || ''} onChange={(e) => handlePrizeChange(index, 'description', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="VD: Bao gồm tiền mặt..." />
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-200">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-500 font-bold">Icon:</label>
                                                            <select value={item.icon || 'trophy'} onChange={(e) => handlePrizeChange(index, 'icon', e.target.value)} className="p-1.5 border rounded text-sm">
                                                                <option value="trophy">🏆 Trophy</option>
                                                                <option value="crown">👑 Crown</option>
                                                                <option value="medal">🥇 Medal</option>
                                                                <option value="star">⭐ Star</option>
                                                                <option value="gift">🎁 Gift</option>
                                                                <option value="sparkles">✨ Sparkles</option>
                                                                <option value="award">🎖️ Award</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-500 font-bold">Số lượng:</label>
                                                            <select value={item.multiplier || ''} onChange={(e) => handlePrizeChange(index, 'multiplier', e.target.value)} className="p-1.5 border rounded text-sm">
                                                                <option value="">1 (mặc định)</option>
                                                                <option value="2x">2x</option>
                                                                <option value="3x">3x</option>
                                                                <option value="4x">4x</option>
                                                                <option value="5x">5x</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-500 font-bold">Màu nổi bật:</label>
                                                            <div className="flex gap-1">
                                                                {/* Presets */}
                                                                {[
                                                                    { color: 'orange', bg: 'bg-orange-400', border: 'border-orange-500', label: 'Cam (Mặc định)' },
                                                                    { color: 'red', bg: 'bg-red-400', border: 'border-red-500', label: 'Đỏ' },
                                                                    { color: 'blue', bg: 'bg-blue-400', border: 'border-blue-500', label: 'Xanh dương' },
                                                                    { color: 'green', bg: 'bg-green-400', border: 'border-green-500', label: 'Xanh lá' },
                                                                    { color: 'purple', bg: 'bg-purple-400', border: 'border-purple-500', label: 'Tím' },
                                                                    { color: 'pink', bg: 'bg-pink-400', border: 'border-pink-500', label: 'Hồng' },
                                                                    { color: 'cyan', bg: 'bg-cyan-400', border: 'border-cyan-500', label: 'Xanh ngọc' }
                                                                ].map(c => {
                                                                    // Check if this color is selected. 
                                                                    // If color is 'orange', it's selected if item.highlightColor is 'orange' OR empty/undefined (default)
                                                                    const isSelected = item.highlightColor === c.color || (c.color === 'orange' && !item.highlightColor);

                                                                    return (
                                                                        <button
                                                                            key={c.color}
                                                                            type="button"
                                                                            onClick={() => handlePrizeChange(index, 'highlightColor', c.color)}
                                                                            className={`w-5 h-5 rounded ${c.bg} border-2 transition-all ${isSelected ? `${c.border} ring-2 ring-offset-1 ring-${c.color}-300` : 'border-transparent hover:scale-110'}`}
                                                                            title={c.label}
                                                                        />
                                                                    );
                                                                })}

                                                                {/* Custom Color Picker */}
                                                                <div className="relative group/picker" title="Chọn màu tùy ý">
                                                                    <label className={`w-5 h-5 rounded border-2 overflow-hidden flex items-center justify-center cursor-pointer transition-all bg-white relative ${item.highlightColor?.startsWith('#') ? 'border-gray-400 ring-2 ring-offset-1 ring-gray-300' : 'border-gray-300 border-dashed hover:border-gray-400 hover:scale-110'}`}>
                                                                        {/* Background Color Display (if chosen) */}
                                                                        {item.highlightColor?.startsWith('#') ? (
                                                                            <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: item.highlightColor }} />
                                                                        ) : (
                                                                            <span className="text-gray-400 text-[10px] leading-none select-none">+</span>
                                                                        )}
                                                                        <input
                                                                            type="color"
                                                                            value={item.highlightColor?.startsWith('#') ? item.highlightColor : '#f97316'}
                                                                            onChange={(e) => handlePrizeChange(index, 'highlightColor', e.target.value)}
                                                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer p-0 border-0"
                                                                        />
                                                                    </label>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-500 font-bold">Đậm nhạt:</label>
                                                            <select value={item.hoverIntensity || 'medium'} onChange={(e) => handlePrizeChange(index, 'hoverIntensity', e.target.value)} className="p-1 px-2 border rounded text-xs bg-white text-gray-700 h-6 outline-none focus:border-blue-500" title="Cường độ màu khi hover">
                                                                <option value="soft">Nhạt</option>
                                                                <option value="medium">Vừa</option>
                                                                <option value="strong">Đậm</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={() => { const newItems = items.filter((_, i) => i !== index); handleChange('items', newItems); }} className="ml-auto text-red-500 text-xs hover:underline">Xóa giải này</button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => handleChange('items', [...items, { title: 'Giải mới', description: 'Mô tả giải thưởng', value: '500.000 VNĐ', highlight: false }])} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"><Plus size={16} /> Thêm giải thưởng</button>
                                        </div>
                                    </div>
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
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                accept="image/*,video/*"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                                title="Tải ảnh/video từ máy"
                                            >
                                                <Upload size={18} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">* Hỗ trợ link online hoặc tải file từ máy (Tự động chuyển thành Base64).</p>
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

                                    {/* Video Controls (Only show if type is video or src is video) */}
                                    {(formData.type === 'video' || formData.src?.match(/\.(mp4|webm|ogg)$|youtube\.com|youtu\.be/)) && (
                                        <div className="space-y-3 pt-2 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-gray-700">Cài đặt Video</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 p-2 rounded border hover:bg-white transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.autoPlay || false}
                                                        onChange={(e) => handleChange('autoPlay', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Tự động phát</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 p-2 rounded border hover:bg-white transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.muted || false}
                                                        onChange={(e) => handleChange('muted', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Tắt tiếng (Mute)</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 p-2 rounded border hover:bg-white transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.loop || false}
                                                        onChange={(e) => handleChange('loop', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Lặp lại (Loop)</span>
                                                </label>

                                                <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 p-2 rounded border hover:bg-white transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.controls !== false} // Default to true if undefined
                                                        onChange={(e) => handleChange('controls', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Hiện điều khiển</span>
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">* Lưu ý: Trình duyệt thường yêu cầu <b>Tắt tiếng</b> để cho phép <b>Tự động phát</b>.</p>
                                        </div>
                                    )}

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

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // CTA Editor
                        if (selectedComponent.type === 'CTA') {
                            return (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Nhãn nút (Label)</label>
                                            <input
                                                type="text"
                                                value={formData.label || ''}
                                                onChange={(e) => handleChange('label', e.target.value)}
                                                className="w-full p-2 border rounded-md font-bold"
                                                placeholder="VD: Đăng ký ngay"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Đường dẫn (Link)</label>
                                            <input
                                                type="text"
                                                value={formData.link || ''}
                                                onChange={(e) => handleChange('link', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Kiểu dáng</label>
                                            <select
                                                value={formData.style || 'primary'}
                                                onChange={(e) => handleChange('style', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="primary">Primary (Blue)</option>
                                                <option value="secondary">Secondary (Dark)</option>
                                                <option value="outline">Outline (Viền)</option>
                                                <option value="ghost">Ghost (Trong suốt)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Kích thước</label>
                                            <select
                                                value={formData.size || 'medium'}
                                                onChange={(e) => handleChange('size', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="small">Nhỏ</option>
                                                <option value="medium">Vừa</option>
                                                <option value="large">Lớn</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Vị trí (Align)</label>
                                            <div className="flex bg-gray-100 p-1 rounded-lg gap-1 border border-gray-200">
                                                {['left', 'center', 'right'].map(align => (
                                                    <button
                                                        key={align}
                                                        onClick={() => handleChange('align', align)}
                                                        className={`flex-1 p-2 rounded flex items-center justify-center ${formData.align === align ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                                    >
                                                        {align === 'left' && <AlignLeft size={18} />}
                                                        {align === 'center' && <AlignCenter size={18} />}
                                                        {align === 'right' && <AlignRight size={18} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.fullWidth || false}
                                                onChange={(e) => handleChange('fullWidth', e.target.checked)}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Full Width (Rộng hết cỡ)</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.icon || false}
                                                onChange={(e) => handleChange('icon', e.target.checked)}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Hiện Icon mũi tên</span>
                                        </label>
                                    </div>

                                    {/* Preview */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                                        <button className={`
                                            font-bold transition-all duration-300 rounded-lg transform active:scale-95 flex items-center justify-center
                                            ${formData.size === 'small' ? 'px-4 py-2 text-sm' : ''}
                                            ${formData.size === 'medium' ? 'px-6 py-3 text-base' : ''}
                                            ${formData.size === 'large' ? 'px-10 py-4 text-lg shadow-lg' : ''}
                                            ${formData.style === 'primary' ? 'bg-blue-600 text-white border-2 border-transparent' : ''}
                                            ${formData.style === 'secondary' ? 'bg-slate-900 text-white border-2 border-transparent' : ''}
                                            ${formData.style === 'outline' ? 'bg-transparent text-blue-600 border-2 border-blue-600' : ''}
                                            ${formData.style === 'ghost' ? 'bg-transparent text-slate-600 border-2 border-transparent' : ''}
                                            ${formData.fullWidth ? 'w-full' : ''}
                                        `}>
                                            {formData.label || 'Button'}
                                            {formData.icon && <span className="ml-2">→</span>}
                                        </button>
                                    </div>

                                    {/* Background Color Config */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-4">
                                        <span className="text-sm font-medium text-gray-700">Màu nền khung:</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.backgroundColor || '#ffffff'}
                                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                                className="w-8 h-8 p-0.5 border rounded cursor-pointer"
                                                title="Chọn màu nền"
                                            />
                                            {!formData.backgroundColor && <span className="text-xs text-gray-500">(Trong suốt)</span>}
                                            {formData.backgroundColor && (
                                                <button
                                                    onClick={() => handleChange('backgroundColor', '')}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
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
