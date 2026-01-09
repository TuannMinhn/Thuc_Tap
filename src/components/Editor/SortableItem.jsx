import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableItem = ({ id, children, isEditing, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled: !isEditing });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...props} className={props.className || "relative"}>
            {children}
            {isEditing && (
                <button
                    {...attributes}
                    {...listeners}
                    className="absolute top-1/2 -left-8 -translate-y-1/2 p-1.5 bg-white text-gray-400 hover:text-blue-500 rounded shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all z-10"
                    title="Kéo để sắp xếp"
                >
                    <GripVertical size={16} />
                </button>
            )}
        </div>
    );
};

export default SortableItem;
