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

    // Copy/Paste clipboard
    const [clipboard, setClipboard] = useState(null);

    // History for Undo/Redo
    const [history, setHistory] = useState({ past: [], future: [] });

    // Save status for loading states
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'

    // Save to LocalStorage whenever config changes
    useEffect(() => {
        const activeDraftId = localStorage.getItem('activeDraftId') || 'draft_cntt';
        localStorage.setItem(activeDraftId, JSON.stringify(config));

        // Show save status
        setSaveStatus('saved');
        const timer = setTimeout(() => setSaveStatus(null), 2000);
        return () => clearTimeout(timer);
    }, [config]);

    // Keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, config]); // Dependencies are crucial here

    // Refs for accessing latest state in stable callbacks
    const configRef = React.useRef(config);
    const historyRef = React.useRef(history);

    useEffect(() => {
        configRef.current = config;
        historyRef.current = history;
    }, [config, history]);

    const saveHistory = React.useCallback(() => {
        const currentConfig = configRef.current;
        setHistory(prev => {
            const newPast = [...prev.past, currentConfig];
            if (newPast.length > 50) newPast.shift(); // Limit history
            return {
                past: newPast,
                future: []
            };
        });
    }, []);

    const undo = React.useCallback(() => {
        const currentHistory = historyRef.current;
        if (currentHistory.past.length === 0) return;

        const previous = currentHistory.past[currentHistory.past.length - 1];
        const newPast = currentHistory.past.slice(0, -1);

        setHistory({
            past: newPast,
            future: [configRef.current, ...currentHistory.future]
        });
        setConfig(previous);
    }, []);

    const redo = React.useCallback(() => {
        const currentHistory = historyRef.current;
        if (currentHistory.future.length === 0) return;

        const next = currentHistory.future[0];
        const newFuture = currentHistory.future.slice(1);

        setHistory({
            past: [...currentHistory.past, configRef.current],
            future: newFuture
        });
        setConfig(next);
    }, []);

    const updateHeader = React.useCallback((newHeader) => {
        saveHistory();
        setConfig(prev => ({ ...prev, header: { ...prev.header, ...newHeader } }));
    }, [saveHistory]);

    const updateFooter = React.useCallback((newFooter) => {
        saveHistory();
        setConfig(prev => ({ ...prev, footer: { ...prev.footer, ...newFooter } }));
    }, [saveHistory]);

    const updateSection = React.useCallback((sectionId, newSectionData) => {
        saveHistory();
        setConfig(prev => ({
            ...prev,
            sections: prev.sections.map(sec => sec.id === sectionId ? { ...sec, ...newSectionData } : sec)
        }));
    }, [saveHistory]);

    const addSection = React.useCallback((index) => {
        saveHistory();
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
    }, [saveHistory]);

    const deleteSection = React.useCallback((sectionId) => {
        if (window.confirm("Are you sure you want to delete this section?")) {
            saveHistory();
            setConfig(prev => ({
                ...prev,
                sections: prev.sections.filter(sec => sec.id !== sectionId)
            }));
        }
    }, [saveHistory]);

    const moveSection = React.useCallback((index, direction) => {
        saveHistory();
        setConfig(prev => {
            const newSections = [...prev.sections];
            if (direction === 'up' && index > 0) {
                [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
            } else if (direction === 'down' && index < newSections.length - 1) {
                [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
            }
            return { ...prev, sections: newSections };
        });
    }, [saveHistory]);

    const updateComponent = React.useCallback((sectionId, colIndex, compIndex, newData) => {
        saveHistory();

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
    }, [saveHistory]);

    const copyComponent = React.useCallback((component) => {
        const copiedComponent = JSON.parse(JSON.stringify(component)); // Deep copy
        delete copiedComponent.id; // Remove ID so paste creates new one
        setClipboard(copiedComponent);
    }, []);

    const pasteComponent = React.useCallback((sectionId, colIndex) => {
        setClipboard(currentClipboard => {
            if (!currentClipboard) return currentClipboard;

            // We need to access clipboard state here. 
            // Ideally pasteComponent should just read clipboard state.
            // But since we are inside a callback optimization, we need access to the current clipboard value.
            // Standard pattern: pass it as arg or use ref.
            // OR: Since clipboard changes much less frequently than config, we can include it in dependency array?
            // NO, that breaks stability.
            // Let's use a ref for clipboard too or just let it depend on clipboard since it's a specific user action.
            // Actually, the cleanest way for `pasteComponent` is to NOT depend on `clipboard` state but read it from a Ref or we accept it changes when clipboard changes.
            // Let's rely on the setConfig updater pattern but we need the DATA to paste.

            // Issue: We can't use 'setClipboard' to READ clipboard.
            // We need a clipboardRef.
            return currentClipboard;
        });
        // RE-DESIGN: The simplest way is to accept that pasteComponent changes when clipboard changes. 
        // ComponentControls will re-render when clipboard content changes (to enable/disable paste button), which is fine.
        return configRef.current; // Dummy return
    }, []);

    // Correction: We need clipboardRef to make pasteComponent stable if we want.
    // However, the button "Paste" usually needs to know if clipboard is empty to be disabled.
    // So components using it will likely subscribe to `clipboard` state anyway.
    // So making `pasteComponent` stable isn't the highest priority if the UI depends on the data.
    // BUT for the sake of consistency, let's keep it simple.
    // Let's stick to the previous implementation but wrap in useCallback with [clipboard].
    // It will change when clipboard changes, but that's acceptable.

    // Memoizing the context value is the most important part.
    const contextValue = React.useMemo(() => ({
        config,
        setConfig,
        isEditing,
        setIsEditing,
        selectedComponent,
        setSelectedComponent,
        activeSectionId,
        setActiveSectionId,
        clipboard,
        saveStatus,
        history,
        actions: {
            updateHeader,
            updateFooter,
            updateSection,
            addSection,
            deleteSection,
            moveSection,
            updateComponent,
            copyComponent,
            pasteComponent: (sid, cidx) => {
                // Hack to get latest clipboard without ref? No, just use clipboard from closure and add to deps.
                if (!clipboard) return;
                saveHistory();
                const newComponent = { ...clipboard, id: `comp-${Date.now()}` };
                setConfig(prev => ({
                    ...prev,
                    sections: prev.sections.map(sec => {
                        if (sec.id !== sid) return sec;
                        const newColumns = [...sec.columns];
                        newColumns[cidx] = { ...newColumns[cidx], components: [...newColumns[cidx].components, newComponent] };
                        return { ...sec, columns: newColumns };
                    })
                }));
            },
            undo,
            redo,
        }
    }), [config, isEditing, selectedComponent, activeSectionId, clipboard, saveStatus, history, updateHeader, updateFooter, updateSection, addSection, deleteSection, moveSection, updateComponent, copyComponent, undo, redo, saveHistory]);

    return (
        <BuilderContext.Provider value={contextValue}>
            {children}
        </BuilderContext.Provider>
    );
};
