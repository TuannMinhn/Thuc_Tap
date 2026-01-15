import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../../context/BuilderContext';
import { landingPageConfig as sampleConfig } from '../../data/landingPageConfig';
import { Plus, LayoutTemplate, File, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { setConfig } = useBuilder();

    const handleCreateBlank = () => {
        const blankConfig = {
            header: {
                title: "Trang Mới",
                logo: "",
                backgroundColor: "bg-white",
                textColor: "text-slate-900",
                menuItems: []
            },
            footer: {
                showFooter: true,
                backgroundColor: "bg-slate-900",
                textColor: "text-white",
                copyrightText: "© 2024 My Website",
                columns: []
            },
            sections: [
                {
                    id: "hero-1",
                    layout: "1-col",
                    style: { backgroundColor: "bg-white", padding: "py-24" },
                    columns: [{ components: [{ type: "RichText", data: { title: "Tiêu đề trang", content: "Nội dung giới thiệu..." } }] }]
                }
            ]
        };
        setConfig(blankConfig);
        navigate('/editor');
    };

    const handleUseSample = () => {
        setConfig(sampleConfig);
        navigate('/editor');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navbar giả lập cho Dashboard */}
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
                    <LayoutTemplate />
                    <span>Landing Builder</span>
                </div>
                <div className="flex gap-4">
                    <button className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Dự án</button>
                    <button className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Tài khoản</button>
                </div>
            </div>

            <main className="flex-grow p-8 max-w-6xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Bắt đầu dự án mới</h1>
                    <p className="text-slate-500">Chọn một mẫu để bắt đầu xây dựng Landing Page của bạn.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Blank Page */}
                    <div
                        onClick={handleCreateBlank}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-dashed border-gray-300 hover:border-blue-400 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[300px]"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Trang Trắng</h3>
                        <p className="text-slate-500 text-center text-sm mb-6">Tự do sáng tạo từ con số 0 với giao diện trống hoàn toàn.</p>
                        <span className="text-blue-600 font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Tạo ngay <ArrowRight size={16} />
                        </span>
                    </div>

                    {/* Card 2: Sample Template */}
                    <div
                        onClick={handleUseSample}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-transparent hover:border-blue-400 overflow-hidden cursor-pointer transition-all duration-300 relative"
                    >
                        {/* Preview/Thumbnail Area */}
                        <div className="h-40 bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
                            <LayoutTemplate size={48} className="relative z-10" />
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Mẫu Khoa CNTT</h3>
                            <p className="text-slate-500 text-sm mb-4">Giao diện mẫu đầy đủ Header, Footer và các section giới thiệu, thống kê.</p>
                            <span className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                Sử dụng mẫu <ArrowRight size={16} />
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
