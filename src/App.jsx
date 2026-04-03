import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import PageBuilder from './components/Builder/PageBuilder';
import Dashboard from './components/Dashboard/Dashboard';
import LandingPage from './pages/LandingPage';
import SectionDetailPage from './pages/SectionDetailPage';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import EditorToolbar from './components/Editor/EditorToolbar';
import PropertyModal from './components/Editor/PropertyModal';
import SectionSettingsModal from './components/Editor/SectionSettingsModal';
import SaveToast from './components/Editor/SaveToast';
import PreviewFrame from './components/Editor/PreviewFrame';

// Route helper to set Edit Mode based on URL
const RouteHandler = ({ mode }) => {
  const { setIsEditing } = useBuilder();

  useEffect(() => {
    setIsEditing(mode === 'admin');
  }, [mode, setIsEditing]);

  return <PageContent showToolbar={mode === 'admin'} />;
};

const PageContent = ({ showToolbar }) => {
  const { config, isEditing } = useBuilder();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header config={config.header} />

      <div className="flex-grow">
        {showToolbar && !isEditing ? (
          <PreviewFrame>
            <PageBuilder sections={config.sections} />
          </PreviewFrame>
        ) : (
          <PageBuilder sections={config.sections} />
        )}
      </div>

      <Footer config={config.footer} />

      {showToolbar && (
        <>
          <EditorToolbar />
          <PropertyModal />
          <SectionSettingsModal />
          <SaveToast />
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
          {/* Dashboard - Admin panel (trang chủ để chọn làm tiếp hay tạo mới) */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Editor - Page builder */}
          <Route path="/editor" element={<RouteHandler mode="admin" />} />
          
          {/* Preview - Old preview mode */}
          <Route path="/preview" element={<RouteHandler mode="public" />} />
          
          {/* Landing Page - Public landing page with previews */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Section Detail Pages - Dynamic routes */}
          <Route path="/landing/:sectionId" element={<SectionDetailPage />} />
        </Routes>
      </BuilderProvider>
    </BrowserRouter>
  );
}

export default App;
