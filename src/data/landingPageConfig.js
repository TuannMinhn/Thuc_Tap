export const landingPageConfig = {
    header: {
        showHeader: true, // NEW: Show/hide header
        title: "KHOA CNTT",
        logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/03/Logo-LHU-Dai-Hoc-Lac-Hong-Horizontal-02.png",
        backgroundColor: "bg-white",
        textColor: "text-slate-900",
        menuItems: [
            { label: "Trang chủ", link: "#hero" },
            { label: "Giới thiệu", link: "#gioi-thieu" },
            { 
                label: "Đào tạo", 
                link: "#dao-tao",
                children: [
                    { label: "Kỹ Thuật Phần Mềm", link: "#dao-tao" },
                    { label: "Trí Tuệ Nhân Tạo", link: "#dao-tao" },
                    { label: "Khoa Học Dữ Liệu", link: "#dao-tao" },
                    { label: "An Toàn Thông Tin", link: "#dao-tao" }
                ]
            },
            { label: "Thống kê", link: "#thong-ke" },
            { label: "Liên hệ", link: "#lien-he" },
        ],
        ctaButtonLabel: "Liên hệ",
        ctaButtonLink: "#lien-he"
    },
    footer: {
        showFooter: true,
        backgroundColor: "bg-slate-900",
        textColor: "text-white",
        copyrightText: "© 2026 Khoa CNTT – Trường XYZ. Đơn vị quản lý: Khoa CNTT | Email: cntt@xyz.edu.vn",
        columns: []
    },
    sections: [
        {
            id: "hero",
            layout: "1-col",
            style: {
                backgroundColor: "bg-gradient-to-r from-blue-700 to-cyan-500",
                textColor: "text-white",
                padding: "py-32",
            },
            columns: [
                {
                    id: "col-hero-1",
                    components: [
                        {
                            id: "comp-hero-title",
                            type: "RichText",
                            data: {
                                title: "CÔNG NGHỆ THÔNG TIN",
                                subtitle: "Kiến Tạo Tương Lai Số - Dẫn Đầu Xu Thế Công Nghệ",
                                content: "Đào tạo kỹ sư công nghệ chất lượng cao, vững chuyên môn, giỏi kỹ năng, sẵn sàng hội nhập quốc tế.",
                                align: "text-center",
                                contentStyle: { preset: 'body', size: 'text-lg' }
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "gioi-thieu",
            layout: "2-col",
            style: {
                backgroundColor: "bg-white",
                textColor: "text-gray-900",
                padding: "py-20"
            },
            columns: [
                {
                    id: "col-intro-1",
                    components: [
                        {
                            id: "comp-intro-img",
                            type: "Media",
                            data: {
                                src: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=800",
                                alt: "Coding",
                                caption: "Môi trường học tập hiện đại và năng động"
                            }
                        }
                    ]
                },
                {
                    id: "col-intro-2",
                    components: [
                        {
                            id: "comp-intro-text",
                            type: "RichText",
                            data: {
                                title: "Về Khoa CNTT",
                                subtitle: "Sứ mệnh & Tầm nhìn",
                                content: "Khoa Công nghệ Thông tin cam kết mang đến môi trường học tập tiên tiến, kết hợp giữa lý thuyết chuyên sâu và thực hành ứng dụng.\n\nChúng tôi tập trung vào các lĩnh vực mũi nhọn như: Kỹ nghệ phần mềm, Trí tuệ nhân tạo (AI), Khoa học dữ liệu và An toàn thông tin.",
                                align: "text-left"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "thong-ke",
            layout: "4-col",
            style: {
                backgroundColor: "bg-blue-50",
                textColor: "text-blue-800",
                padding: "py-16"
            },
            columns: [
                {
                    id: "col-stat-1",
                    components: [
                        {
                            id: "comp-stat-1",
                            type: "RichText",
                            data: { title: "25+", subtitle: "NĂM KINH NGHIỆM", align: "text-center" }
                        }
                    ]
                },
                {
                    id: "col-stat-2",
                    components: [
                        {
                            id: "comp-stat-2",
                            type: "RichText",
                            data: { title: "12.000+", subtitle: "CỰU SINH VIÊN", align: "text-center" }
                        }
                    ]
                },
                {
                    id: "col-stat-3",
                    components: [
                        {
                            id: "comp-stat-3",
                            type: "RichText",
                            data: { title: "100%", subtitle: "CÓ VIỆC LÀM", align: "text-center" }
                        }
                    ]
                },
                {
                    id: "col-stat-4",
                    components: [
                        {
                            id: "comp-stat-4",
                            type: "RichText",
                            data: { title: "200+", subtitle: "ĐỐI TÁC DOANH NGHIỆP", align: "text-center" }
                        }
                    ]
                }
            ]
        },
        {
            id: "thanh-tich",
            layout: "1-col",
            style: {
                backgroundColor: "bg-white",
                textColor: "text-gray-900",
                padding: "py-20"
            },
            columns: [
                {
                    id: "col-prize-1",
                    components: [
                        {
                            id: "comp-prize-title",
                            type: "RichText",
                            data: {
                                title: "Giải thưởng",
                                subtitle: "Cơ cấu giải thưởng hấp dẫn",
                                content: "",
                                align: "text-center"
                            }
                        },
                        {
                            id: "comp-prize-list",
                            type: "Prize",
                            data: {
                                items: [
                                    { title: "Giải nhất", subtitle: "3.000.000 VNĐ", icon: "trophy" },
                                    { title: "Giải nhì", subtitle: "2.000.000 VNĐ", icon: "award" }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "dao-tao",
            
            // Preview cho landing page
            preview: {
                title: "Chương Trình Đào Tạo",
                subtitle: "Đào tạo chất lượng cao",
                description: "4 chuyên ngành đào tạo: Kỹ Thuật Phần Mềm, Trí Tuệ Nhân Tạo, Khoa Học Dữ Liệu, và An Toàn Thông Tin. Chương trình được thiết kế theo chuẩn quốc tế với đội ngũ giảng viên giàu kinh nghiệm.",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
                icon: "🎓",
                ctaText: "Xem chi tiết",
                ctaLink: "/landing/dao-tao"
            },
            
            // Detail cho detail page
            detail: {
                hero: {
                    title: "Chương Trình Đào Tạo",
                    subtitle: "Đào tạo kỹ sư công nghệ thông tin chất lượng cao, đáp ứng nhu cầu thị trường"
                },
                additionalContent: `
                    <h2 class="text-3xl font-bold mb-4">Mục tiêu đào tạo</h2>
                    <p class="text-lg mb-6">Chương trình đào tạo của Khoa CNTT hướng đến việc trang bị cho sinh viên kiến thức chuyên sâu, kỹ năng thực hành và tư duy sáng tạo trong lĩnh vực công nghệ thông tin.</p>
                    
                    <h2 class="text-3xl font-bold mb-4 mt-8">Cấu trúc chương trình</h2>
                    <ul class="list-disc list-inside text-lg space-y-2 mb-6">
                        <li>Kiến thức nền tảng: 40 tín chỉ (Toán, Lý, Tiếng Anh)</li>
                        <li>Kiến thức chuyên ngành: 60 tín chỉ (Lập trình, Cơ sở dữ liệu, Mạng máy tính...)</li>
                        <li>Thực tập và đồ án: 20 tín chỉ</li>
                        <li>Tổng cộng: 120 tín chỉ (4 năm)</li>
                    </ul>
                    
                    <h2 class="text-3xl font-bold mb-4 mt-8">Phương pháp giảng dạy</h2>
                    <p class="text-lg mb-4">Kết hợp giữa lý thuyết và thực hành, học qua dự án thực tế, làm việc nhóm và thuyết trình.</p>
                `,
                relatedSections: ["tuyen-sinh", "faq"],
                cta: {
                    text: "Đăng ký tư vấn",
                    link: "#lien-he"
                }
            },
            
            layout: "3-col",
            style: {
                backgroundColor: "bg-white",
                textColor: "text-gray-800",
                padding: "py-24"
            },
            columns: [
                {
                    id: "col-train-1",
                    components: [
                        {
                            id: "comp-train-img-1",
                            type: "Media",
                            data: {
                                src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
                                alt: "Software Engineering",
                                aspectRatio: "aspect-video"
                            }
                        },
                        {
                            id: "comp-train-text-1",
                            type: "RichText",
                            data: {
                                title: "Kỹ Thuật Phần Mềm",
                                content: "Phát triển ứng dụng web, mobile, hệ thống doanh nghiệp với các công nghệ mới nhất.",
                                align: "text-center"
                            }
                        }
                    ]
                },
                {
                    id: "col-train-2",
                    components: [
                        {
                            id: "comp-train-img-2",
                            type: "Media",
                            data: {
                                src: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=600",
                                alt: "AI",
                                aspectRatio: "aspect-video"
                            }
                        },
                        {
                            id: "comp-train-text-2",
                            type: "RichText",
                            data: {
                                title: "Trí Tuệ Nhân Tạo",
                                content: "Nghiên cứu và ứng dụng Machine Learning, Deep Learning, Computer Vision.",
                                align: "text-center"
                            }
                        }
                    ]
                },
                {
                    id: "col-train-3",
                    components: [
                        {
                            id: "comp-train-img-3",
                            type: "Media",
                            data: {
                                src: "https://images.unsplash.com/photo-1563206767-5b1d972e8136?auto=format&fit=crop&q=80&w=600",
                                alt: "Data Science",
                                aspectRatio: "aspect-video"
                            }
                        },
                        {
                            id: "comp-train-text-3",
                            type: "RichText",
                            data: {
                                title: "Khoa Học Dữ Liệu",
                                content: "Phân tích, xử lý dữ liệu lớn (Big Data) và hỗ trợ ra quyết định thông mình.",
                                align: "text-center"
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "lich-su",
            layout: "1-col",
            style: {
                backgroundColor: "bg-gray-50",
                textColor: "text-gray-900",
                padding: "py-20"
            },
            columns: [
                {
                    id: "col-history-1",
                    components: [
                        {
                            id: "comp-history-title",
                            type: "RichText",
                            data: {
                                title: "Lịch Sử Hình Thành",
                                subtitle: "Hành trình phát triển",
                                content: "Chặng đường hơn 20 năm xây dựng và trưởng thành của Khoa CNTT.",
                                align: "text-center"
                            }
                        },
                        {
                            id: "comp-history-timeline",
                            type: "Timeline",
                            data: {
                                items: [
                                    { date: "2000", title: "Thành lập Khoa", description: "Khoa CNTT được thành lập với khóa sinh viên đầu tiên." },
                                    { date: "2010", title: "Mở rộng quy mô", description: "Khánh thành tòa nhà mới và mở thêm chuyên ngành Kỹ thuật phần mềm." },
                                    { date: "2018", title: "Kiểm định chất lượng", description: "Đạt chuẩn kiểm định chất lượng giáo dục AUN-QA." },
                                    { date: "2024", title: "Tiên phong công nghệ", description: "Triển khai chương trình đào tạo AI và Big Data." }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "tuyen-sinh",
            
            // Preview cho landing page
            preview: {
                title: "Tuyển Sinh",
                subtitle: "Quy trình đơn giản",
                description: "3 bước đơn giản để trở thành sinh viên Khoa CNTT. Đăng ký trực tuyến, nộp hồ sơ và nhận giấy báo trúng tuyển. Chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt quá trình.",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
                icon: "📝",
                ctaText: "Xem quy trình",
                ctaLink: "/landing/tuyen-sinh"
            },
            
            // Detail cho detail page
            detail: {
                hero: {
                    title: "Quy Trình Tuyển Sinh",
                    subtitle: "Hướng dẫn chi tiết từng bước để trở thành sinh viên Khoa CNTT"
                },
                additionalContent: `
                    <h2 class="text-3xl font-bold mb-4">Điều kiện xét tuyển</h2>
                    <ul class="list-disc list-inside text-lg space-y-2 mb-6">
                        <li>Tốt nghiệp THPT hoặc tương đương</li>
                        <li>Điểm thi THPT Quốc gia đạt yêu cầu (từ 18 điểm trở lên)</li>
                        <li>Ưu tiên thí sinh có chứng chỉ tin học, ngoại ngữ</li>
                    </ul>
                    
                    <h2 class="text-3xl font-bold mb-4 mt-8">Hồ sơ cần thiết</h2>
                    <ul class="list-disc list-inside text-lg space-y-2 mb-6">
                        <li>Bằng tốt nghiệp THPT (bản sao công chứng)</li>
                        <li>Học bạ THPT (bản sao công chứng)</li>
                        <li>Giấy khai sinh (bản sao)</li>
                        <li>4 ảnh 3x4 (chụp trong vòng 6 tháng)</li>
                        <li>Phiếu đăng ký xét tuyển</li>
                    </ul>
                    
                    <h2 class="text-3xl font-bold mb-4 mt-8">Thời gian tuyển sinh</h2>
                    <p class="text-lg mb-4">Đợt 1: Tháng 3 - Tháng 5<br>Đợt 2: Tháng 6 - Tháng 8</p>
                `,
                relatedSections: ["dao-tao", "faq"],
                cta: {
                    text: "Đăng ký ngay",
                    link: "#lien-he"
                }
            },
            
            layout: "1-col",
            style: {
                backgroundColor: "bg-blue-50",
                textColor: "text-gray-900",
                padding: "py-20"
            },
            columns: [
                {
                    id: "col-steps-1",
                    components: [
                        {
                            id: "comp-steps-title",
                            type: "RichText",
                            data: {
                                title: "Quy Trình Tuyển Sinh",
                                subtitle: "3 Bước đơn giản để trở thành sinh viên Khoa CNTT",
                                content: "",
                                align: "text-center"
                            }
                        },
                        {
                            id: "comp-steps-list",
                            type: "Steps",
                            data: {
                                items: [
                                    { step: "01", title: "Đăng ký trực tuyến", description: "Điền hồ sơ xét tuyển trên cổng thông tin tuyển sinh của trường." },
                                    { step: "02", title: "Nộp hồ sơ", description: "Gửi hồ sơ bản cứng về văn phòng tuyển sinh hoặc qua đường bưu điện." },
                                    { step: "03", title: "Nhập học", description: "Nhận giấy báo trúng tuyển và làm thủ tục nhập học chính thức." }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: "faq",
            layout: "1-col",
            style: {
                backgroundColor: "bg-white",
                textColor: "text-gray-900",
                padding: "py-20"
            },
            columns: [
                {
                    id: "col-faq-1",
                    components: [
                        {
                            id: "comp-faq-title",
                            type: "RichText",
                            data: {
                                title: "Câu Hỏi Thường Gặp",
                                subtitle: "Tư vấn tuyển sinh & Đào tạo",
                                content: "Giải đáp những thắc mắc phổ biến của sinh viên và phụ huynh.",
                                align: "text-center"
                            }
                        },
                        {
                            id: "comp-faq-list",
                            type: "FAQ",
                            data: {
                                items: [
                                    { question: "Thời gian đào tạo là bao lâu?", answer: "Chương trình kỹ sư đào tạo trong 4.5 năm, cử nhân 4 năm." },
                                    { question: "Cơ hội việc làm sau khi ra trường?", answer: "100% sinh viên có việc làm đúng chuyên ngành sau 6 tháng tốt nghiệp." },
                                    { question: "Khoa có hỗ trợ thực tập không?", answer: "Có. Khoa liên kết với hơn 50 doanh nghiệp để hỗ trợ nơi thực tập và việc làm cho sinh viên." },
                                    { question: "Học phí của ngành CNTT là bao nhiêu?", answer: "Học phí khoảng 15-20 triệu/học kỳ, ổn định trong toàn khóa học." }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
