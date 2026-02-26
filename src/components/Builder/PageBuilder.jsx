import React, { useCallback, useMemo } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import SectionControls from '../Editor/SectionControls';
import ComponentPickerModal from '../Editor/ComponentPickerModal';
import ConfirmationModal from '../Editor/ConfirmationModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import BuilderSection from './BuilderSection';

const PageBuilder = React.memo(({ sections: propSections }) => {
    const { config, isEditing, actions, setSelectedComponent, clipboard } = useBuilder();
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

    const handleDragEnd = useCallback((event) => {
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
    }, [sections, actions]);

    const handleComponentClick = useCallback((e, sectionId, colIndex, compIndex, component) => {
        if (!isEditing) return;
        e.stopPropagation();
        setSelectedComponent({ sectionId, colIndex, compIndex, data: component.data, type: component.type });
    }, [isEditing, setSelectedComponent]);

    const handleAddComponent = useCallback((sectionId, colIndex) => {
        setActiveLocation({ sectionId, colIndex });
        setPickerOpen(true);
    }, []);

    const handleDeleteClick = useCallback((e, sectionId, colIndex, compIndex) => {
        e.stopPropagation();
        setDeleteConfirm({ sectionId, colIndex, compIndex });
    }, []);

    const handleDeleteComponent = useCallback((e, sectionId, colIndex, compIndex) => { // Kept for API compatibility if needed by BuilderSection, though we use confirm mostly
        e.stopPropagation();
        setDeleteConfirm({ sectionId, colIndex, compIndex });
    }, []);


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


    if (!sections || sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-gray-300 rounded-lg m-4 min-h-[300px] bg-gray-50">
                <p className="text-gray-500 mb-4">Chưa có nội dung. Tạo Section đầu tiên để bắt đầu.</p>
                <button
                    onClick={() => actions.addSection(0)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105"
                >
                    <PlusCircle size={20} />
                    Tạo Section Mới
                </button>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <main className={isEditing ? "pb-24" : ""}>
                {sections.map((section, sectionIndex) => (
                    <BuilderSection
                        key={section.id || sectionIndex}
                        section={section}
                        index={sectionIndex}
                        isEditing={isEditing}
                        isFirst={sectionIndex === 0}
                        isLast={sectionIndex === sections.length - 1}
                        actions={actions}
                        clipboard={clipboard}
                        onComponentClick={handleComponentClick}
                        onAddComponent={handleAddComponent}
                        onDeleteComponent={handleDeleteComponent}
                        onDeleteClick={handleDeleteClick}
                    />
                ))}

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
});

export default PageBuilder;
