import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useBuilder } from '../context/BuilderContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import BuilderSection from '../components/Builder/BuilderSection';

/**
 * SectionDetailPage - Trang hiển thị chi tiết đầy đủ của một section
 * URL: /{sectionId}
 */
const SectionDetailPage = () => {
    const { sectionId } = useParams();
    const { config } = useBuilder();

    // Tìm section theo ID
    const section = config.sections?.find(s => s.id === sectionId);

    // Nếu không tìm thấy section, redirect về landing page
    if (!section) {
        return <Navigate to="/landing" replace />;
    }

    const { detail } = section;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header config={config.header} />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link 
                            to="/landing" 
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <Home size={16} />
                            <span>Trang chủ</span>
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">
                            {detail?.title || section.id}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section for Detail Page */}
                {detail?.hero && (
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
                        <div className="container mx-auto px-4">
                            <Link 
                                to="/landing"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Quay lại trang chủ</span>
                            </Link>
                            
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {detail.hero.title}
                            </h1>
                            
                            {detail.hero.subtitle && (
                                <p className="text-xl text-white/90 max-w-3xl">
                                    {detail.hero.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Detail Content - Render full section */}
                <div className="container mx-auto px-4 py-12">
                    {/* Render the actual section with all its components */}
                    <BuilderSection
                        section={section}
                        index={0}
                        isEditing={false}
                        isFirst={true}
                        isLast={true}
                        actions={{}}
                        clipboard={null}
                        onComponentClick={() => {}}
                        onAddComponent={() => {}}
                        onDeleteComponent={() => {}}
                        onDeleteClick={() => {}}
                    />

                    {/* Additional Detail Content */}
                    {detail?.additionalContent && (
                        <div className="mt-12 prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: detail.additionalContent }} />
                        </div>
                    )}
                </div>

                {/* Related Sections */}
                {detail?.relatedSections && detail.relatedSections.length > 0 && (
                    <div className="bg-gray-100 py-12">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Xem thêm
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {detail.relatedSections.map((relatedId) => {
                                    const relatedSection = config.sections?.find(s => s.id === relatedId);
                                    if (!relatedSection?.preview) return null;
                                    
                                    return (
                                        <Link
                                            key={relatedId}
                                            to={`/landing/${relatedId}`}
                                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all"
                                        >
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {relatedSection.preview.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {relatedSection.preview.description}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sticky CTA */}
                {detail?.cta && (
                    <div className="fixed bottom-6 right-6 z-40">
                        <a
                            href={detail.cta.link || '#lien-he'}
                            className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
                        >
                            {detail.cta.text || 'Liên hệ ngay'}
                        </a>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer config={config.footer} />
        </div>
    );
};

export default SectionDetailPage;
