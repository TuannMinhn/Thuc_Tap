import React, { useState } from 'react';
import { Type, Image, X, Video, Hash, Clock, HelpCircle, ListOrdered, Award, ChevronDown, ChevronUp, LayoutTemplate, MousePointerClick, Mail } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const COMPONENT_TYPES = [
    {
        type: 'RichText',
        label: 'Text / Content Block',
        icon: Type,
        description: 'Block nền tảng: Tiêu đề, đoạn văn',
        color: 'bg-blue-50 text-blue-600',
        defaultData: {
            title: '',
            subtitle: '',
            content: '',
            align: 'text-left'
        },
        presets: [
            {
                label: 'Chỉ Tiêu Đề',
                description: 'Chỉ hiển thị tiêu đề lớn, không có phụ đề hay nội dung.',
                data: {
                    title: 'Tiêu đề chính',
                }
            },
            {
                label: 'Chỉ Phụ Đề',
                description: 'Chỉ hiển thị phụ đề nhỏ, không có tiêu đề chính.',
                data: {
                    subtitle: 'Dòng phụ đề mô tả ngắn gọn',
                }
            },
            {
                label: 'Chỉ Nội Dung',
                description: 'Chỉ có đoạn văn bản, không có tiêu đề.',
                data: {
                    content: 'Đoạn văn bản mô tả chi tiết nội dung. Có thể dài hoặc ngắn tùy nhu cầu.',
                }
            },
            {
                label: 'Tiêu Đề + Phụ Đề',
                description: 'Kết hợp tiêu đề chính và phụ đề, không có nội dung.',
                data: {
                    title: 'Tiêu đề chính',
                    subtitle: 'Phụ đề bổ sung',
                }
            },
            {
                label: 'Căn Giữa',
                description: 'Nội dung căn giữa, phù hợp cho intro hoặc hero section.',
                data: {
                    title: 'Tiêu đề căn giữa',
                    content: 'Nội dung căn giữa trang.',
                    align: 'text-center'
                }
            }
        ]
    },
    {
        type: 'Stats',
        label: 'Stats / Metrics Block',
        icon: Hash,
        description: 'Dữ liệu tổng, con số ấn tượng',
        color: 'bg-yellow-50 text-yellow-600',
        defaultData: {
            items: []
        },
        presets: [
            {
                label: '1 Số Liệu',
                description: 'Chỉ hiển thị một con số ấn tượng duy nhất.',
                data: {
                    items: [
                        { value: '1M+', label: 'Người dùng' }
                    ]
                }
            },
            {
                label: '2 Số Liệu',
                description: 'Hiển thị 2 con số song song.',
                data: {
                    items: [
                        { value: '10K+', label: 'Khách hàng' },
                        { value: '4.9/5', label: 'Đánh giá' }
                    ]
                }
            },
            {
                label: '3 Số Liệu',
                description: 'Hiển thị 3 con số dạng lưới.',
                data: {
                    items: [
                        { value: '500+', label: 'Dự án' },
                        { value: '98%', label: 'Hài lòng' },
                        { value: '24/7', label: 'Hỗ trợ' }
                    ]
                }
            },
            {
                label: '4 Số Liệu',
                description: 'Hiển thị 4 con số dạng lưới đầy đủ.',
                data: {
                    items: [
                        { value: '10K', label: 'Học viên' },
                        { value: '50+', label: 'Khóa học' },
                        { value: '98%', label: 'Hài lòng' },
                        { value: '30+', label: 'Giảng viên' }
                    ]
                }
            },
            {
                label: 'Có Mô Tả',
                description: 'Số liệu kèm mô tả chi tiết bên dưới.',
                data: {
                    items: [
                        { value: '24/7', label: 'Hỗ trợ', description: 'Đội ngũ kỹ thuật trực chiến 24/7' },
                        { value: '100%', label: 'Bảo mật', description: 'Mã hóa dữ liệu đầu cuối' }
                    ]
                }
            }
        ]
    },
    {
        type: 'Media',
        label: 'Image / Banner Block',
        icon: Image,
        description: 'Ảnh đơn, banner quảng cáo',
        color: 'bg-purple-50 text-purple-600',
        defaultData: { 
            src: '', 
            alt: 'Image', 
            aspectRatio: 'aspect-video'
        },
        presets: [
            {
                label: 'Ảnh Vuông',
                description: 'Ảnh tỷ lệ 1:1, phù hợp cho avatar hoặc logo.',
                data: {
                    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
                    alt: 'Square image',
                    aspectRatio: 'aspect-square'
                }
            },
            {
                label: 'Ảnh Ngang (16:9)',
                description: 'Ảnh tỷ lệ 16:9, chuẩn video/banner.',
                data: {
                    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
                    alt: 'Landscape image',
                    aspectRatio: 'aspect-video'
                }
            },
            {
                label: 'Ảnh Rộng (21:9)',
                description: 'Ảnh siêu rộng, phù hợp cho hero banner.',
                data: {
                    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200',
                    alt: 'Wide image',
                    aspectRatio: 'aspect-[21/9]'
                }
            },
            {
                label: 'Ảnh Có Chú Thích',
                description: 'Ảnh kèm caption mô tả bên dưới.',
                data: {
                    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
                    alt: 'Image with caption',
                    aspectRatio: 'aspect-video',
                    caption: 'Mô tả chi tiết cho hình ảnh'
                }
            },
            {
                label: 'Ảnh Tràn Viền',
                description: 'Ảnh full-width không padding, tràn hết màn hình.',
                data: {
                    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
                    alt: 'Full width image',
                    aspectRatio: 'aspect-video',
                    fullWidth: true
                }
            }
        ]
    },
    {
        type: 'Media',
        label: 'Video Embed Block',
        icon: Video,
        description: 'Nhúng video Youtube/Vimeo',
        color: 'bg-red-50 text-red-600',
        defaultData: { 
            type: 'video', 
            src: '', 
            alt: 'Video'
        },
        presets: [
            {
                label: 'Video Cơ Bản',
                description: 'Video có controls, người dùng tự bấm play.',
                data: {
                    type: 'video',
                    src: '',
                    autoPlay: false,
                    muted: false,
                    loop: false,
                    controls: true
                }
            },
            {
                label: 'Video Autoplay',
                description: 'Video tự động phát, không tiếng, lặp lại (như GIF).',
                data: {
                    type: 'video',
                    src: '',
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    controls: false
                }
            },
            {
                label: 'Video Có Caption',
                description: 'Video kèm chú thích mô tả bên dưới.',
                data: {
                    type: 'video',
                    src: '',
                    controls: true,
                    caption: 'Mô tả video'
                }
            }
        ]
    },
    {
        type: 'Timeline',
        label: 'Timeline Block',
        icon: Clock,
        description: 'Lịch trình, mốc thời gian',
        color: 'bg-green-50 text-green-600',
        defaultData: { 
            items: []
        },
        presets: [
            {
                label: '3 Mốc Thời Gian',
                description: 'Timeline ngắn với 3 mốc quan trọng.',
                data: {
                    items: [
                        { date: '2022', title: 'Khởi đầu', description: 'Bắt đầu dự án' },
                        { date: '2023', title: 'Phát triển', description: 'Mở rộng quy mô' },
                        { date: '2024', title: 'Hiện tại', description: 'Vị trí hàng đầu' }
                    ]
                }
            },
            {
                label: '5 Mốc Thời Gian',
                description: 'Timeline chi tiết với 5 mốc phát triển.',
                data: {
                    items: [
                        { date: '2020', title: 'Ý tưởng', description: 'Hình thành ý tưởng ban đầu' },
                        { date: '2021', title: 'Thành lập', description: 'Thành lập công ty' },
                        { date: '2022', title: 'Sản phẩm đầu tiên', description: 'Ra mắt sản phẩm' },
                        { date: '2023', title: 'Mở rộng', description: 'Mở chi nhánh mới' },
                        { date: '2024', title: 'Dẫn đầu', description: 'Top 1 thị trường' }
                    ]
                }
            },
            {
                label: 'Quy Trình (Steps)',
                description: 'Hiển thị các bước thực hiện tuần tự.',
                data: {
                    items: [
                        { step: 'Bước 1', title: 'Đăng ký', description: 'Tạo tài khoản' },
                        { step: 'Bước 2', title: 'Xác thực', description: 'Xác nhận email' },
                        { step: 'Bước 3', title: 'Sử dụng', description: 'Bắt đầu trải nghiệm' }
                    ]
                }
            }
        ]
    },
    {
        type: 'FAQ',
        label: 'FAQ / Accordion Block',
        icon: HelpCircle,
        description: 'Hỏi đáp, câu hỏi thường gặp',
        color: 'bg-orange-50 text-orange-600',
        defaultData: { 
            items: []
        },
        presets: [
            {
                label: '1 Câu Hỏi',
                description: 'Chỉ một câu hỏi và câu trả lời.',
                data: {
                    items: [
                        { question: 'Sản phẩm có bảo hành không?', answer: 'Có, chúng tôi bảo hành 12 tháng.' }
                    ]
                }
            },
            {
                label: '3 Câu Hỏi',
                description: 'Danh sách 3 câu hỏi phổ biến.',
                data: {
                    items: [
                        { question: 'Làm thế nào để đăng ký?', answer: 'Nhấn nút Đăng ký và điền thông tin.' },
                        { question: 'Chi phí là bao nhiêu?', answer: 'Gói cơ bản từ 99k/tháng.' },
                        { question: 'Có hỗ trợ 24/7 không?', answer: 'Có, chúng tôi hỗ trợ 24/7.' }
                    ]
                }
            },
            {
                label: '5 Câu Hỏi',
                description: 'Danh sách đầy đủ 5 câu hỏi thường gặp.',
                data: {
                    items: [
                        { question: 'Làm thế nào để đăng ký?', answer: 'Nhấn nút Đăng ký và điền thông tin.' },
                        { question: 'Chi phí là bao nhiêu?', answer: 'Gói cơ bản từ 99k/tháng.' },
                        { question: 'Có hỗ trợ 24/7 không?', answer: 'Có, chúng tôi hỗ trợ 24/7.' },
                        { question: 'Có thể hủy bất cứ lúc nào?', answer: 'Có, không ràng buộc hợp đồng.' },
                        { question: 'Có bảo mật dữ liệu không?', answer: 'Có, mã hóa SSL 256-bit.' }
                    ]
                }
            }
        ]
    },
    {
        type: 'Steps',
        label: 'Steps / Process Block',
        icon: ListOrdered,
        description: 'Quy trình thực hiện',
        color: 'bg-cyan-50 text-cyan-600',
        defaultData: { 
            items: []
        },
        presets: [
            {
                label: '2 Bước',
                description: 'Quy trình đơn giản 2 bước.',
                data: {
                    items: [
                        { step: '01', title: 'Đăng ký', description: 'Tạo tài khoản' },
                        { step: '02', title: 'Sử dụng', description: 'Bắt đầu ngay' }
                    ]
                }
            },
            {
                label: '3 Bước',
                description: 'Quy trình 3 bước phổ biến.',
                data: {
                    items: [
                        { step: '01', title: 'Đăng ký', description: 'Điền form thông tin' },
                        { step: '02', title: 'Xác nhận', description: 'Xác nhận email' },
                        { step: '03', title: 'Hoàn tất', description: 'Bắt đầu sử dụng' }
                    ]
                }
            },
            {
                label: '4 Bước',
                description: 'Quy trình chi tiết 4 bước.',
                data: {
                    items: [
                        { step: '01', title: 'Khảo sát', description: 'Đánh giá nhu cầu' },
                        { step: '02', title: 'Thiết kế', description: 'Lên phương án' },
                        { step: '03', title: 'Triển khai', description: 'Thực hiện dự án' },
                        { step: '04', title: 'Bàn giao', description: 'Nghiệm thu' }
                    ]
                }
            },
            {
                label: '5 Bước',
                description: 'Quy trình đầy đủ 5 bước.',
                data: {
                    items: [
                        { step: '01', title: 'Tư vấn', description: 'Tiếp nhận yêu cầu' },
                        { step: '02', title: 'Báo giá', description: 'Đưa ra phương án' },
                        { step: '03', title: 'Ký hợp đồng', description: 'Thỏa thuận điều khoản' },
                        { step: '04', title: 'Thực hiện', description: 'Triển khai dự án' },
                        { step: '05', title: 'Bảo hành', description: 'Hỗ trợ sau bán' }
                    ]
                }
            }
        ]
    },
    {
        type: 'Prize',
        label: 'Prize / Rewards Block',
        icon: Award,
        description: 'Giải thưởng cuộc thi, danh hiệu',
        color: 'bg-pink-50 text-pink-600',
        defaultData: {
            items: []
        },
        presets: [
            {
                label: 'Giải Nhất',
                description: 'Chỉ hiển thị giải thưởng cao nhất.',
                data: {
                    items: [
                        { title: 'Giải Nhất', description: 'Giải thưởng cao nhất', value: '10.000.000 VNĐ', highlight: true }
                    ]
                }
            },
            {
                label: 'Top 3',
                description: 'Hiển thị 3 giải thưởng chính (Nhất - Nhì - Ba).',
                data: {
                    items: [
                        { title: 'Giải Nhất', value: '5.000.000 VNĐ', highlight: true },
                        { title: 'Giải Nhì', value: '3.000.000 VNĐ', highlight: true },
                        { title: 'Giải Ba', value: '1.000.000 VNĐ', highlight: true }
                    ]
                }
            },
            {
                label: 'Đầy Đủ (5 Giải)',
                description: 'Bảng giải đầy đủ với giải chính và giải phụ.',
                data: {
                    items: [
                        { title: 'Giải Nhất', value: '5.000.000 VNĐ', highlight: true },
                        { title: 'Giải Nhì', value: '3.000.000 VNĐ', highlight: true },
                        { title: 'Giải Ba', value: '1.000.000 VNĐ', highlight: true },
                        { title: 'Giải Khuyến Khích', value: '500.000 VNĐ', multiplier: '2x' },
                        { title: 'Giải Bình Chọn', value: '500.000 VNĐ' }
                    ]
                }
            },
            {
                label: 'Có Mô Tả',
                description: 'Giải thưởng kèm mô tả chi tiết.',
                data: {
                    items: [
                        { title: 'Giải Nhất', description: 'Bao gồm tiền mặt, giấy khen và quà tặng', value: '5.000.000 VNĐ', highlight: true },
                        { title: 'Giải Nhì', description: 'Bao gồm tiền mặt và giấy khen', value: '3.000.000 VNĐ', highlight: true }
                    ]
                }
            },
            {
                label: 'Danh Hiệu',
                description: 'Chỉ hiển thị tên và mô tả, không có giá trị tiền.',
                data: {
                    items: [
                        { title: 'Giải Sáng Tạo', description: 'Dành cho ý tưởng đột phá' },
                        { title: 'Giải Cống Hiến', description: 'Dành cho thành viên lâu năm' },
                        { title: 'Giải Triển Vọng', description: 'Dành cho nhân tố mới' }
                    ]
                }
            }
        ]
    },
    {
        type: 'CTA',
        label: 'CTA / Button Block',
        icon: MousePointerClick,
        description: 'Nút bấm kêu gọi hành động',
        color: 'bg-green-50 text-green-600',
        defaultData: { 
            label: '', 
            link: '#', 
            style: 'primary', 
            size: 'medium', 
            align: 'center' 
        },
        presets: [
            {
                label: 'Nút Chính (Primary)',
                description: 'Nút màu chủ đạo, nổi bật nhất.',
                data: { 
                    label: 'Đăng Ký Ngay', 
                    link: '#', 
                    style: 'primary', 
                    size: 'large', 
                    align: 'center' 
                }
            },
            {
                label: 'Nút Phụ (Secondary)',
                description: 'Nút màu tối, trang trọng.',
                data: { 
                    label: 'Tìm Hiểu Thêm', 
                    link: '#', 
                    style: 'secondary', 
                    size: 'medium', 
                    align: 'center' 
                }
            },
            {
                label: 'Nút Viền (Outline)',
                description: 'Nút viền tinh tế, không nổi bật.',
                data: { 
                    label: 'Xem Chi Tiết', 
                    link: '#', 
                    style: 'outline', 
                    size: 'medium', 
                    align: 'center' 
                }
            },
            {
                label: 'Nút Nhỏ',
                description: 'Nút kích thước nhỏ gọn.',
                data: { 
                    label: 'Xem thêm', 
                    link: '#', 
                    style: 'primary', 
                    size: 'small', 
                    align: 'center' 
                }
            },
            {
                label: 'Nút Lớn',
                description: 'Nút kích thước lớn, thu hút sự chú ý.',
                data: { 
                    label: 'Bắt Đầu Ngay', 
                    link: '#', 
                    style: 'primary', 
                    size: 'large', 
                    align: 'center' 
                }
            }
        ]
    },
    {
        type: 'ContactForm',
        label: 'Contact Form Block',
        icon: Mail,
        description: 'Biểu mẫu liên hệ',
        color: 'bg-indigo-50 text-indigo-600',
        defaultData: {
            blockTitle: '',
            blockSubtitle: '',
            showContactInfo: false,
            formFields: ['name', 'email', 'message']
        },
        presets: [
            {
                label: 'Chỉ Form',
                description: 'Chỉ có form liên hệ, không hiển thị thông tin liên hệ.',
                data: {
                    blockTitle: 'Liên hệ với chúng tôi',
                    blockSubtitle: 'Gửi tin nhắn và chúng tôi sẽ phản hồi sớm',
                    showContactInfo: false,
                    formFields: ['name', 'email', 'message']
                }
            },
            {
                label: 'Form + Thông Tin',
                description: 'Form kèm thông tin liên hệ (email, phone, address).',
                data: {
                    blockTitle: 'Liên hệ với chúng tôi',
                    blockSubtitle: 'Gửi tin nhắn hoặc liên hệ trực tiếp',
                    showContactInfo: true,
                    contactInfo: {
                        email: 'contact@example.com',
                        phone: '(+84) 123 456 789',
                        address: '123 Đường ABC, Quận 1, TP.HCM'
                    },
                    formFields: ['name', 'email', 'message']
                }
            },
            {
                label: 'Form Đầy Đủ',
                description: 'Form với tất cả trường (name, email, phone, subject, message).',
                data: {
                    blockTitle: 'Liên hệ với chúng tôi',
                    blockSubtitle: 'Điền đầy đủ thông tin để được hỗ trợ tốt nhất',
                    showContactInfo: true,
                    contactInfo: {
                        email: 'support@company.com',
                        phone: '(+84) 123 456 789',
                        address: '123 Đường ABC, Quận 1, TP.HCM'
                    },
                    formFields: ['name', 'email', 'phone', 'subject', 'message']
                }
            },
            {
                label: 'Form Hỗ Trợ',
                description: 'Form dành cho yêu cầu hỗ trợ kỹ thuật.',
                data: {
                    blockTitle: 'Yêu cầu hỗ trợ',
                    blockSubtitle: 'Đội ngũ kỹ thuật sẽ hỗ trợ bạn trong 2h',
                    showContactInfo: true,
                    contactInfo: {
                        email: 'support@company.com',
                        phone: 'Hotline: 1900 xxxx',
                        address: 'Hỗ trợ 24/7'
                    },
                    formFields: ['name', 'email', 'phone', 'subject', 'message']
                }
            }
        ]
    }
];

const ComponentPickerModal = ({ isOpen, onClose, onSelect }) => {
    useLockBodyScroll(isOpen);
    const [expandedId, setExpandedId] = useState(null);

    // Reset expanded state when modal closes
    React.useEffect(() => {
        if (!isOpen) setExpandedId(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTypeClick = (item) => {
        if (expandedId === item.label) {
            setExpandedId(null); // Toggle off
        } else {
            setExpandedId(item.label); // Expand
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50 shrink-0">
                    <h3 className="font-bold text-lg text-gray-800">Chọn Block</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0">
                    <div className="p-4 grid gap-3">
                        {COMPONENT_TYPES.map((item) => {
                            const Icon = item.icon;
                            const isExpanded = expandedId === item.label;
                            const hasPresets = item.presets && item.presets.length > 0;

                            return (
                                <div key={item.type} className="border border-gray-200 rounded-lg overflow-hidden transition-all bg-white hover:border-blue-300">
                                    <button
                                        onClick={() => hasPresets ? handleTypeClick(item) : onSelect(item.type, item.defaultData)}
                                        className={`w-full flex items-start gap-4 p-4 text-left group transition-all ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className={`p-3 rounded-lg ${item.color} ${isExpanded ? 'bg-white shadow-sm' : 'group-hover:bg-white group-hover:shadow-sm'} transition-all`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`font-bold transition-colors ${isExpanded ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-700'}`}>
                                                    {item.label}
                                                </h4>
                                                {hasPresets && (
                                                    <div className="text-gray-400">
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                        </div>
                                    </button>

                                    {/* Presets / Variants Area */}
                                    {isExpanded && hasPresets && (
                                        <div className="bg-gray-50/80 p-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">Chọn mẫu (Presets)</div>
                                                {/* Default Option */}
                                                <button
                                                    onClick={() => onSelect(item.type, item.defaultData)}
                                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-left"
                                                >
                                                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <LayoutTemplate size={14} />
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">Mặc định</div>
                                                </button>

                                                {/* Preset Options */}
                                                {item.presets.map((preset, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => onSelect(item.type, preset.data)}
                                                        className="flex items-center gap-3 p-2 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-left relative group select-none"
                                                    >
                                                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                                                            <span className="font-bold text-xs">{idx + 1}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-700 truncate">{preset.label}</div>
                                                        </div>

                                                        {/* Info Icon + Tooltip */}
                                                        {preset.description && (
                                                            <div className="text-gray-300 hover:text-blue-500 relative group/info shrink-0 transition-colors">
                                                                <HelpCircle size={16} />

                                                                {/* Tooltip Content */}
                                                                <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 pointer-events-none z-[100] transform translate-y-2 group-hover/info:translate-y-0 text-balance leading-relaxed">
                                                                    {preset.description}
                                                                    {/* Arrow */}
                                                                    <div className="absolute right-1 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentPickerModal;
