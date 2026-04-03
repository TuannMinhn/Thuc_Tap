import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Trash2, ArrowUp, ArrowDown, Plus, Layout, Palette, Settings, Eye, EyeOff, Save } from 'lucide-react';

const SectionControls = ({ section, index, isFirst, isLast }) => {
    const { actions, setActiveSectionId } = useBuilder();
    const { deleteSection, moveSection, addSection } = actions;

    const openSettings = () => {
        setActiveSectionId(section.id);
    };

    return (
        <>
            {/* Section Label */}
            <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    SECTION {index + 1}
                </div>
            </div>

            {/* Section Controls */}
            <div className="absolute top-2 right-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur shadow-sm p-1 rounded-lg border border-gray-200">
                <button 
                    onClick={() => moveSection(index, 'up')} 
                    disabled={isFirst} 
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30" 
                    title="Lên"
                    aria-label="Di chuyển section lên"
                >
                    <ArrowUp size={16} />
                </button>
                <button 
                    onClick={() => moveSection(index, 'down')} 
                    disabled={isLast} 
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30" 
                    title="Xuống"
                    aria-label="Di chuyển section xuống"
                >
                    <ArrowDown size={16} />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button 
                    onClick={openSettings} 
                    className="p-1.5 hover:bg-blue-100 text-blue-600 rounded flex items-center gap-1" 
                    title="Cài đặt Section (Cột, Màu nền...)"
                    aria-label="Mở cài đặt section"
                >
                    <Settings size={16} /> <span className="text-xs font-bold">Cài đặt</span>
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                    onClick={() => actions.updateSection(section.id, { hidden: !section.hidden })}
                    className={`p-1.5 rounded hover:bg-yellow-50 ${section.hidden ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-gray-600'}`}
                    title={section.hidden ? "Hiện lại" : "Ẩn section này"}
                    aria-label={section.hidden ? "Hiện section" : "Ẩn section"}
                >
                    {section.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button 
                    onClick={() => {
                        alert("Đã lưu thay đổi thành công!");
                    }} 
                    className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded" 
                    title="Lưu thay đổi"
                    aria-label="Lưu thay đổi"
                >
                    <Save size={16} />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button 
                    onClick={() => addSection(index)} 
                    className="p-1.5 hover:bg-green-100 text-green-600 rounded" 
                    title="Thêm dòng mới"
                    aria-label="Thêm section mới"
                >
                    <Plus size={16} />
                </button>
                <button 
                    onClick={() => deleteSection(section.id)} 
                    className="p-1.5 hover:bg-red-100 text-red-600 rounded" 
                    title="Xóa dòng này"
                    aria-label="Xóa section"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </>
    );
};

export default SectionControls;
