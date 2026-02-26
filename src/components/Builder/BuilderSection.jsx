import React, { memo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Copy, Trash2, PlusCircle, Clipboard } from 'lucide-react';
import Section from './Section';
import SectionControls from '../Editor/SectionControls';
import SectionCarousel from './SectionCarousel';
import SortableItem from '../Editor/SortableItem';
import RichText from '../Content/RichText';
import Media from '../Content/Media';
import Stats from '../Content/Stats';
import Timeline from '../Content/Timeline';
import FAQ from '../Content/FAQ';
import Steps from '../Content/Steps';
import Prize from '../Content/Prize';
import CTA from '../Content/CTA';

const COMPONENT_MAP = {
    'RichText': RichText,
    'Media': Media,
    'Stats': Stats,
    'Timeline': Timeline,
    'FAQ': FAQ,
    'Steps': Steps,
    'Prize': Prize,
    'CTA': CTA,
};

const BuilderSection = memo(({
    section,
    index,
    isEditing,
    isFirst,
    isLast,
    actions,
    clipboard,
    onComponentClick,
    onAddComponent,
    onDeleteComponent,
    onDeleteClick // for confirmation
}) => {
    // Logic for hidden sections
    if (section.hidden && !isEditing) return null;

    return (
        <div
            id={section.id}
            className={`relative group ${isEditing ? 'hover:outline-2 hover:outline-blue-400 hover:outline-dashed transition-all' : ''} ${section.hidden ? 'opacity-50 grayscale border-2 border-dashed border-yellow-400 m-2 rounded' : ''}`}
        >
            {/* Hidden Indicator */}
            {section.hidden && isEditing && (
                <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 font-bold z-20 rounded-br">
                    ĐANG ẨN (CHỈ HIỆN VỚI ADMIN)
                </div>
            )}

            {isEditing && (
                <SectionControls
                    section={section}
                    index={index}
                    isFirst={isFirst}
                    isLast={isLast}
                />
            )}

            <Section style={section.style} anchorId={section.anchorId}>
                {(() => {
                    const columnContent = section.columns.map((column, colIndex) => {
                        // Determine Alignment for Components (Layout Alignment)
                        const align = section.style?.textAlign || 'text-left';
                        const itemsAlign = {
                            'text-left': 'items-start',
                            'text-center': 'items-center',
                            'text-right': 'items-end',
                            'text-justify': 'items-stretch'
                        }[align] || 'items-start';

                        return (
                            <div key={colIndex} className={`flex flex-col gap-6 h-full ${itemsAlign} ${isEditing ? 'min-h-[50px] p-2 border border-transparent hover:border-blue-200 rounded' : ''}`}>
                                <SortableContext
                                    items={column.components.map(c => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {column.components.map((component, compIndex) => {
                                        const ComponentToRender = COMPONENT_MAP[component.type];
                                        if (!ComponentToRender) return null;
                                        return (
                                            <SortableItem
                                                key={component.id || compIndex} // Prefer ID
                                                id={component.id}
                                                isEditing={isEditing}
                                                onClick={(e) => onComponentClick(e, section.id, colIndex, compIndex, component)}
                                                className={`relative group/comp w-full ${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 rounded p-1 transition-all' : ''}`}
                                            >
                                                <ComponentToRender data={component.data} isEditing={isEditing} />
                                                {isEditing && (
                                                    <div className="absolute top-0 right-0 flex rounded-bl overflow-hidden opacity-0 group-hover/comp:opacity-100 pointer-events-none transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.copyComponent(component);
                                                            }}
                                                            className="bg-purple-500 text-white text-xs px-2 py-1 hover:bg-purple-600 pointer-events-auto flex items-center gap-1"
                                                            title="Copy"
                                                        >
                                                            <Copy size={12} />
                                                        </button>
                                                        <button
                                                            className="bg-blue-500 text-white text-xs px-2 py-1 hover:bg-blue-600 pointer-events-auto"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={(e) => onDeleteClick(e, section.id, colIndex, compIndex)}
                                                            className="bg-red-500 text-white text-xs px-2 py-1 hover:bg-red-600 pointer-events-auto flex items-center"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </SortableItem>
                                        );
                                    })}
                                </SortableContext>

                                {/* Add Component / Paste Buttons */}
                                {isEditing && (
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => onAddComponent(section.id, colIndex)}
                                            className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors font-medium"
                                        >
                                            <PlusCircle size={20} /> Thêm thành phần
                                        </button>
                                        {clipboard && (
                                            <button
                                                onClick={() => actions.pasteComponent(section.id, colIndex)}
                                                className="px-6 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-500 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 flex items-center justify-center gap-2 transition-colors font-medium whitespace-nowrap"
                                                title={`Paste: ${clipboard.type}`}
                                            >
                                                <Clipboard size={18} /> Dán
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>
                        );
                    });

                    if (section.enableCarousel) {
                        return (
                            <SectionCarousel settings={section.carouselSettings} isEditing={isEditing}>
                                {columnContent}
                            </SectionCarousel>
                        );
                    }

                    // Get gap value from section style
                    const gapClass = section.style?.gap || 'gap-6';

                    return (
                        <div
                            className={`grid ${gapClass}`}
                            style={{
                                gridTemplateColumns: `repeat(${parseInt(section.layout) || 1}, minmax(0, 1fr))`
                            }}
                        >
                            {columnContent}
                        </div>
                    );
                })()}
            </Section>
        </div>
    );
});

export default BuilderSection;
