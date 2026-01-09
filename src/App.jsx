import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PageBuilder from './components/Builder/PageBuilder';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import EditorToolbar from './components/Editor/EditorToolbar';
import PropertyModal from './components/Editor/PropertyModal';
import SectionSettingsModal from './components/Editor/SectionSettingsModal';

// Route helper to set Edit Mode based on URL
const RouteHandler = ({ mode }) => {
  const { setIsEditing } = useBuilder();

  useEffect(() => {
    setIsEditing(mode === 'admin');
  }, [mode, setIsEditing]);

  return <PageContent showToolbar={mode === 'admin'} />;
};

const PageContent = ({ showToolbar }) => {
  const { config } = useBuilder();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header config={config.header} />

      <div className="flex-grow">
        <PageBuilder sections={config.sections} />
      </div>

      <Footer config={config.footer} />

      {showToolbar && (
        <>
          <EditorToolbar />
          <PropertyModal />
          <SectionSettingsModal />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <BuilderProvider>
        <Routes>
          <Route path="/" element={<RouteHandler mode="public" />} />
          <Route path="/editor" element={<RouteHandler mode="admin" />} />
        </Routes>
      </BuilderProvider>
    </BrowserRouter>
  );
}

export default App;
