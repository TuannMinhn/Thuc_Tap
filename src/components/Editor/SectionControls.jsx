import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { Trash2, ArrowUp, ArrowDown, Plus, Layout, Palette, Settings } from 'lucide-react';

const SectionControls = ({ section, index, isFirst, isLast }) => {
    const { actions, setActiveSectionId } = useBuilder();
    const { deleteSection, moveSection, addSection } = actions;

    const openSettings = () => {
        setActiveSectionId(section.id);
    };

    return (
        <div className="absolute top-2 right-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur shadow-sm p-1 rounded-lg border border-gray-200">
            <button onClick={() => moveSection(index, 'up')} disabled={isFirst} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30" title="Lên"><ArrowUp size={16} /></button>
            <button onClick={() => moveSection(index, 'down')} disabled={isLast} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30" title="Xuống"><ArrowDown size={16} /></button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button onClick={openSettings} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded flex items-center gap-1" title="Cài đặt Section (Cột, Màu nền...)">
                <Settings size={16} /> <span className="text-xs font-bold">Cài đặt</span>
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button onClick={() => addSection(index)} className="p-1.5 hover:bg-green-100 text-green-600 rounded" title="Thêm dòng mới"><Plus size={16} /></button>
            <button onClick={() => deleteSection(section.id)} className="p-1.5 hover:bg-red-100 text-red-600 rounded" title="Xóa dòng này"><Trash2 size={16} /></button>
        </div>
    );
};

export default SectionControls;
