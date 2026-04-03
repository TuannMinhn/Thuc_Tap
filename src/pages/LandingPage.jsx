import React from 'react';
import { useBuilder } from '../context/BuilderContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SectionPreview from '../components/Content/SectionPreview';
import BuilderSection from '../components/Builder/BuilderSection';

/**
 * LandingPage - Trang chủ hiển thị preview của tất cả sections
 * Sections có preview sẽ hiển thị dạng card với CTA
 * Sections không có preview sẽ hiển thị full content (như hero, stats...)
 */
const LandingPage = () => {
    const { config, isEditing } = useBuilder();

    // Phân loại sections
    const heroSection = config.sections?.find(s => s.id === 'hero');
    const previewSections = config.sections?.filter(s => s.preview && s.id !== 'hero') || [];
    const fullSections = config.sections?.filter(s => !s.preview && s.id !== 'hero') || [];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header config={config.header} />

            <main className="flex-grow">
                {/* Hero Section - Always show full */}
                {heroSection && (
                    <BuilderSection
                        section={heroSection}
                        index={0}
                        isEditing={isEditing}
                        isFirst={true}
                        isLast={false}
                        actions={{}}
                        clipboard={null}
                        onComponentClick={() => {}}
                        onAddComponent={() => {}}
                        onDeleteComponent={() => {}}
                        onDeleteClick={() => {}}
                    />
                )}

                {/* Preview Sections - Show as cards */}
                {previewSections.length > 0 && (
                    <section className="py-20 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Khám Phá Khoa CNTT
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Tìm hiểu về các chương trình đào tạo, cơ hội nghề nghiệp và môi trường học tập tại khoa
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {previewSections.map((section, index) => (
                                    <SectionPreview
                                        key={section.id}
                                        section={section}
                                        isEditing={isEditing}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Full Sections - Show complete content (stats, timeline, etc.) */}
                {fullSections.map((section, index) => (
                    <BuilderSection
                        key={section.id}
                        section={section}
                        index={index + 1}
                        isEditing={isEditing}
                        isFirst={false}
                        isLast={index === fullSections.length - 1}
                        actions={{}}
                        clipboard={null}
                        onComponentClick={() => {}}
                        onAddComponent={() => {}}
                        onDeleteComponent={() => {}}
                        onDeleteClick={() => {}}
                    />
                ))}
            </main>

            {/* Footer */}
            <Footer config={config.footer} />
        </div>
    );
};

export default LandingPage;
