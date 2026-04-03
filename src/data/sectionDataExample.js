/**
 * Example: Cách thêm preview và detail cho sections
 * 
 * Sections CÓ preview: Sẽ hiển thị dạng card trên landing page
 * Sections KHÔNG CÓ preview: Sẽ hiển thị full content trên landing page (hero, stats, timeline...)
 */

export const sectionWithPreviewExample = {
    id: "dao-tao",
    
    // Preview - Hiển thị trên landing page (tóm gọn)
    preview: {
        title: "Chương Trình Đào Tạo",
        subtitle: "Đào tạo chất lượng cao",
        description: "Khám phá các chương trình đào tạo tiên tiến với giảng viên giàu kinh nghiệm và cơ sở vật chất hiện đại. Chúng tôi cam kết mang đến môi trường học tập tốt nhất.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        icon: "🎓",
        ctaText: "Tìm hiểu thêm",
        ctaLink: "/dao-tao"
    },
    
    // Detail - Hiển thị trên trang chi tiết (đầy đủ)
    detail: {
        hero: {
            title: "Chương Trình Đào Tạo Chất Lượng Cao",
            subtitle: "Đào tạo kỹ sư công nghệ thông tin đáp ứng nhu cầu thị trường lao động trong và ngoài nước"
        },
        additionalContent: `
            <h2>Mục tiêu đào tạo</h2>
            <p>Chương trình đào tạo của Khoa CNTT hướng đến việc trang bị cho sinh viên...</p>
            
            <h2>Cấu trúc chương trình</h2>
            <ul>
                <li>Kiến thức nền tảng: 40 tín chỉ</li>
                <li>Kiến thức chuyên ngành: 60 tín chỉ</li>
                <li>Thực tập và đồ án: 20 tín chỉ</li>
            </ul>
        `,
        relatedSections: ["tuyen-sinh", "faq"], // IDs của sections liên quan
        cta: {
            text: "Đăng ký tư vấn",
            link: "#lien-he"
        }
    },
    
    // Layout và components - Hiển thị trên cả landing và detail page
    layout: "3-col",
    style: {
        backgroundColor: "bg-white",
        textColor: "text-gray-800",
        padding: "py-24"
    },
    columns: [
        // ... existing columns
    ]
};

export const sectionWithoutPreviewExample = {
    id: "thong-ke",
    // KHÔNG CÓ preview - sẽ hiển thị full content trên landing page
    
    layout: "4-col",
    style: {
        backgroundColor: "bg-blue-50",
        textColor: "text-blue-800",
        padding: "py-16"
    },
    columns: [
        // ... stats columns
    ]
};
