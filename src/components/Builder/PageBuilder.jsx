import React from 'react';
import Section from './Section';
import RichText from '../Content/RichText';
import Media from '../Content/Media';
import Stats from '../Content/Stats';
import Timeline from '../Content/Timeline';
import FAQ from '../Content/FAQ';
import Steps from '../Content/Steps';
import Prize from '../Content/Prize';
import { useBuilder } from '../../context/BuilderContext';
import SectionControls from '../Editor/SectionControls';
import SectionCarousel from './SectionCarousel';
import ComponentPickerModal from '../Editor/ComponentPickerModal';
import ConfirmationModal from '../Editor/ConfirmationModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from '../Editor/SortableItem';
import { PlusCircle, Trash2 } from 'lucide-react';

const COMPONENT_MAP = {
    'RichText': RichText,
    'Media': Media,
    'Stats': Stats,
    'Timeline': Timeline,
    'FAQ': FAQ,
    'Steps': Steps,
    'Prize': Prize,
};

const PageBuilder = ({ sections: propSections }) => {
    const { config, isEditing, actions, setSelectedComponent, updateComponent } = useBuilder();
    const sections = config.sections || propSections || [];
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [activeLocation, setActiveLocation] = React.useState(null);
    const [deleteConfirm, setDeleteConfirm] = React.useState(null); // { sectionId, colIndex, compIndex }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        // Optimization: Quick check for same column reordering
        for (let sIdx = 0; sIdx < sections.length; sIdx++) {
            const section = sections[sIdx];
            for (let cIdx = 0; cIdx < section.columns.length; cIdx++) {
                const col = section.columns[cIdx];
                const activeIdx = col.components.findIndex(c => c.id === active.id);
                const overIdx = col.components.findIndex(c => c.id === over.id);

                if (activeIdx !== -1 && overIdx !== -1) {
                    // Reordering within the same column
                    const newComponents = arrayMove(col.components, activeIdx, overIdx);
                    const newColumns = [...section.columns];
                    newColumns[cIdx] = { ...col, components: newComponents };
                    actions.updateSection(section.id, { columns: newColumns });
                    return;
                }
            }
        }
    };

    if (!sections || sections.length === 0) {
        return <div className="p-16 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg m-4">Chưa có nội dung. Nhấn nút "+" ở góc để bắt đầu.</div>;
    }

    const handleComponentClick = (e, sectionId, colIndex, compIndex, component) => {
        if (!isEditing) return;
        e.stopPropagation();
        setSelectedComponent({ sectionId, colIndex, compIndex, data: component.data, type: component.type });
    };

    const handleAddComponent = (sectionId, colIndex) => {
        setActiveLocation({ sectionId, colIndex });
        setPickerOpen(true);
    };

    const handleSelectComponent = (type, defaultData) => {
        if (!activeLocation) return;
        const { sectionId, colIndex } = activeLocation;



        const newComponent = {
            id: `comp-${Date.now()}`,
            type,
            data: defaultData
        };

        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        const section = sections[sectionIndex];

        if (section) {
            const newColumns = [...section.columns];
            newColumns[colIndex] = {
                ...newColumns[colIndex],
                components: [...newColumns[colIndex].components, newComponent]
            };
            actions.updateSection(sectionId, { columns: newColumns });
        }

        setPickerOpen(false);
        setActiveLocation(null);
    };

    const handleDeleteClick = (e, sectionId, colIndex, compIndex) => {
        e.stopPropagation();
        setDeleteConfirm({ sectionId, colIndex, compIndex });
    };

    const confirmDelete = () => {
        if (!deleteConfirm) return;
        const { sectionId, colIndex, compIndex } = deleteConfirm;

        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        const section = sections[sectionIndex];

        if (section) {
            const newColumns = [...section.columns];
            const newComponents = [...newColumns[colIndex].components];
            newComponents.splice(compIndex, 1);

            newColumns[colIndex] = {
                ...newColumns[colIndex],
                components: newComponents
            };

            actions.updateSection(sectionId, { columns: newColumns });
        }
        setDeleteConfirm(null);
    };

    const handleDeleteComponent = (e, sectionId, colIndex, compIndex) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc chắn muốn xóa thành phần này không?")) return;

        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        const section = sections[sectionIndex];

        if (section) {
            const newColumns = [...section.columns];
            const newComponents = [...newColumns[colIndex].components];
            newComponents.splice(compIndex, 1);

            newColumns[colIndex] = {
                ...newColumns[colIndex],
                components: newComponents
            };

            actions.updateSection(sectionId, { columns: newColumns });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <main className={isEditing ? "pb-24" : ""}>
                {sections.map((section, sectionIndex) => {
                    // Logic for hidden sections
                    if (section.hidden && !isEditing) return null;

                    return (
                        <div
                            key={section.id || sectionIndex}
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
                                    index={sectionIndex}
                                    isFirst={sectionIndex === 0}
                                    isLast={sectionIndex === sections.length - 1}
                                />
                            )}

                            <Section style={section.style}>
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
                                                                onClick={(e) => handleComponentClick(e, section.id, colIndex, compIndex, component)}
                                                                className={`relative group/comp ${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 rounded p-1 transition-all' : ''}`}
                                                            >
                                                                <ComponentToRender data={component.data} isEditing={isEditing} />
                                                                {isEditing && (
                                                                    <div className="absolute top-0 right-0 flex rounded-bl overflow-hidden opacity-0 group-hover/comp:opacity-100 pointer-events-none transition-opacity">
                                                                        <button
                                                                            className="bg-blue-500 text-white text-xs px-2 py-1 hover:bg-blue-600 pointer-events-auto"
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => handleDeleteClick(e, section.id, colIndex, compIndex)}
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

                                                {/* Add Component Button for Empty or Non-Empty Columns */}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleAddComponent(section.id, colIndex)}
                                                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <PlusCircle size={18} /> Thêm TP
                                                    </button>
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

                                    return (
                                        <div
                                            className={`grid gap-6 ${section.layout === '2-col' ? 'items-center' : ''}`}
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
                })}

                <ComponentPickerModal
                    isOpen={pickerOpen}
                    onClose={() => setPickerOpen(false)}
                    onSelect={handleSelectComponent}
                />

                <ConfirmationModal
                    isOpen={!!deleteConfirm}
                    onClose={() => setDeleteConfirm(null)}
                    onConfirm={confirmDelete}
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa thành phần này? Hành động này không thể hoàn tác."
                    confirmLabel="Xóa ngay"
                />
            </main>
        </DndContext>
    );
};

export default PageBuilder;
