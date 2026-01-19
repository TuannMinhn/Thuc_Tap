import React, { createContext, useContext, useState, useEffect } from 'react';
import { landingPageConfig as initialConfig } from '../data/landingPageConfig';

const BuilderContext = createContext();

export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (!context) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
};

export const BuilderProvider = ({ children }) => {
    const [config, setConfig] = useState(() => {
        try {
            // Determine which draft to load
            const activeDraftId = localStorage.getItem('activeDraftId') || 'draft_cntt';
            const savedConfig = localStorage.getItem(activeDraftId);
            return savedConfig ? JSON.parse(savedConfig) : initialConfig;
        } catch (e) {
            console.error("Failed to load config", e);
            return initialConfig;
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null); // For detailed edit modal
    const [activeSectionId, setActiveSectionId] = useState(null); // For Section Settings Modal

    // Save to LocalStorage whenever config changes
    useEffect(() => {
        const activeDraftId = localStorage.getItem('activeDraftId') || 'draft_cntt';
        localStorage.setItem(activeDraftId, JSON.stringify(config));
    }, [config]);

    const updateHeader = (newHeader) => {
        setConfig(prev => ({ ...prev, header: { ...prev.header, ...newHeader } }));
    };

    const updateFooter = (newFooter) => {
        setConfig(prev => ({ ...prev, footer: { ...prev.footer, ...newFooter } }));
    };

    const updateSection = (sectionId, newSectionData) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(sec => sec.id === sectionId ? { ...sec, ...newSectionData } : sec)
        }));
    };

    const addSection = (index) => {
        const newSection = {
            id: `section-${Date.now()}`,
            layout: "1-col",
            style: { backgroundColor: "bg-white", padding: "py-16" },
            columns: [{ components: [{ type: "RichText", data: { title: "New Section", content: "Edit this text" } }] }]
        };

        setConfig(prev => {
            const newSections = [...prev.sections];
            newSections.splice(index + 1, 0, newSection);
            return { ...prev, sections: newSections };
        });
    };

    const deleteSection = (sectionId) => {
        if (window.confirm("Are you sure you want to delete this section?")) {
            setConfig(prev => ({
                ...prev,
                sections: prev.sections.filter(sec => sec.id !== sectionId)
            }));
        }
    };

    const moveSection = (index, direction) => {
        setConfig(prev => {
            const newSections = [...prev.sections];
            if (direction === 'up' && index > 0) {
                [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
            } else if (direction === 'down' && index < newSections.length - 1) {
                [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
            }
            return { ...prev, sections: newSections };
        });
    };

    const updateComponent = (sectionId, colIndex, compIndex, newData) => {
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(sec => {
                if (sec.id !== sectionId) return sec;

                const newColumns = [...sec.columns];
                const newComponents = [...newColumns[colIndex].components];
                newComponents[compIndex] = { ...newComponents[compIndex], data: { ...newComponents[compIndex].data, ...newData } };
                newColumns[colIndex] = { ...newColumns[colIndex], components: newComponents };

                return { ...sec, columns: newColumns };
            })
        }));
    };

    return (
        <BuilderContext.Provider value={{
            config,
            setConfig,
            isEditing,
            setIsEditing,
            selectedComponent,
            setSelectedComponent,
            activeSectionId,
            setActiveSectionId,
            actions: {
                updateHeader,
                updateFooter,
                updateSection,
                addSection,
                deleteSection,
                moveSection,
                updateComponent
            }
        }}>
            {children}
        </BuilderContext.Provider>
    );
};
