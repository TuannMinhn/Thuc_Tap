import React, { useState } from 'react';
import { Type, Image, X, Video, Hash, Clock, HelpCircle, ListOrdered, Award, ChevronDown, ChevronUp, LayoutTemplate, MousePointerClick } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const COMPONENT_TYPES = [
    {
        type: 'RichText',
        label: 'Text / Content Block',
        icon: Type,
        description: 'Block nền tảng: Tiêu đề, đoạn văn',
        color: 'bg-blue-50 text-blue-600',
        defaultData: {
            title: 'Tiêu đề section hấp dẫn',
            content: 'Đoạn văn ngắn gọn (2-3 câu) mô tả nội dung chính của phần này. Hãy viết xúc tích, đi thẳng vào vấn đề và mang lại giá trị cho người đọc.'
        },
        presets: [
            {
                label: 'Tiêu Đề Mục',
                description: 'Dùng để ngăn cách các phần nội dung lớn.',
                data: {
                    title: 'Ví dụ: Tính năng chính',
                    // align default is left, but we can omit if component handles it. Keeping it clean.
                }
            },
            {
                label: 'Tiêu Đề + Mô Tả',
                description: 'Cấu trúc tiêu chuẩn với tiêu đề và đoạn văn mô tả chi tiết.',
                data: {
                    title: 'Theo dõi tiến độ học tập',
                    content: 'Quản lý tiến độ môn học và lớp học theo thời gian thực',
                }
            },
            {
                label: 'Tiêu Đề + Phụ Đề',
                description: 'Nhấn mạnh tiêu đề chính kèm dòng phụ chú nhỏ.',
                data: {
                    title: 'Quản lý tiến độ học tập thông minh',
                    subtitle: 'Mọi dữ liệu học tập trên một dashboard duy nhất',
                }
            },
            {
                label: 'Giới Thiệu Căn Giữa',
                description: 'Thu hút sự chú ý, tối ưu cho lời chào hoặc thông điệp chính.',
                data: {
                    content: 'Nền tảng giúp nhà trường theo dõi và cải thiện tiến độ học tập.',
                    align: 'text-center' // Must force center alignment here
                }
            },
            {
                label: 'Đoạn Văn Đơn',
                description: 'Đoạn văn đơn thuần, thích hợp cho ghi chú hoặc footer.',
                data: {
                    content: 'Hệ thống tự động tổng hợp dữ liệu và hiển thị trực quan.'
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
            items: [
                { value: '1M+', label: 'Người dùng hoạt động' },
                { value: '4.9', label: 'Xếp hạng sao' },
                { value: '24/7', label: 'Hỗ trợ kỹ thuật' }
            ]
        },
        presets: [
            {
                label: 'Số Liệu Nổi Bật (1)',
                description: 'Tập trung vào một con số ấn tượng nhất.',
                data: {
                    items: [
                        { value: 'Top #1', label: 'Thị phần Việt Nam', description: 'Được bình chọn bởi người dùng 2024.' }
                    ]
                }
            },
            {
                label: 'Thống Kê Cơ Bản',
                description: 'Hiển thị các con số thống kê dạng lưới tự động (3-4 cột).',
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
                label: 'Số Liệu + Mô Tả',
                description: 'Số liệu kèm mô tả chi tiết.',
                data: {
                    items: [
                        { value: '24/7', label: 'Hỗ trợ', description: 'Đội ngũ kỹ thuật trực chiến 24/7.' },
                        { value: '100%', label: 'Bảo mật', description: 'Mã hóa dữ liệu đầu cuối an toàn.' }
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
        defaultData: { src: '', alt: 'Image', aspectRatio: 'aspect-video', caption: 'Mô tả ngắn về hình ảnh nếu cần' },
        presets: [
            {
                label: 'Ảnh Tràn Viền',
                description: 'Ảnh rộng hết màn hình, không có chú thích.',
                data: {
                    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
                    alt: 'Banner',
                    aspectRatio: 'aspect-video',
                    fullWidth: true
                    // No caption
                }
            },
            {
                label: 'Ảnh Bìa (Hero)',
                description: 'Ảnh khổ rộng (21:9) làm điểm nhấn đầu trang.',
                data: {
                    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200',
                    alt: 'Hero',
                    aspectRatio: 'aspect-[21/9]',
                    fullWidth: true
                    // No caption
                }
            }, // Added standard option for completeness if user wants caption
            {
                label: 'Ảnh Minh Họa',
                description: 'Ảnh trong khung tiêu chuẩn kèm chú thích.',
                data: {
                    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
                    alt: 'Minh họa',
                    aspectRatio: 'aspect-video',
                    fullWidth: false,
                    caption: 'Mô tả chi tiết cho hình ảnh minh họa.'
                }
            },
        ]
    },
    {
        type: 'Media',
        label: 'Video Embed Block',
        icon: Video,
        description: 'Nhúng video Youtube/Vimeo',
        color: 'bg-red-50 text-red-600',
        defaultData: { type: 'video', src: '', alt: 'Video', aspectRatio: 'aspect-video', caption: 'Video giới thiệu tổng quan' },
        presets: [
            {
                label: 'Video Player (Cơ bản)',
                description: 'Video có trình điều khiển, người dùng tự bấm play.',
                data: {
                    type: 'video',
                    src: '',
                    align: 'center',
                    caption: 'Xem video để hiểu rõ hơn về chúng tôi',
                    autoPlay: false,
                    muted: false,
                    loop: false,
                    controls: true
                }
            },
            {
                label: 'Video Autoplay (Giống GIF)',
                description: 'Video tự chạy, không tiếng, lặp lại (Dùng làm nền/hiệu ứng).',
                data: {
                    type: 'video',
                    src: 'https://cdn.coverr.co/videos/coverr-typing-on-computer-keyboard-5503/1080p.mp4',
                    align: 'center',
                    autoPlay: true,
                    muted: true,
                    loop: true,
                    controls: false,
                    caption: ''
                }
            },
        ]
    },
    {
        type: 'Timeline',
        label: 'Timeline Block',
        icon: Clock,
        description: 'Lịch trình, mốc thời gian',
        color: 'bg-green-50 text-green-600',
        defaultData: { items: [{ date: '2024', title: 'Khởi đầu', description: 'Giai đoạn xây dựng nền móng.' }] },
        presets: [
            {
                label: 'Lịch sử phát triển',
                description: 'Kể lại hành trình hình thành và phát triển theo thời gian.',
                data: {
                    items: [
                        { year: '2022', title: 'Khởi tạo ý tưởng', description: 'Hình thành nhu cầu xây dựng hệ thống quản lý tiến độ học tập.' },
                        { year: '2023', title: 'Phát triển hệ thống', description: 'Xây dựng dashboard và thử nghiệm nội bộ.' },
                        { year: '2024', title: 'Triển khai thực tế', description: 'Áp dụng cho nhiều lớp và theo dõi theo năm học.' }
                    ]
                }
            },
            {
                label: 'Lộ trình triển khai',
                description: 'Roadmap kế hoạch các bước thực hiện trong tương lai.',
                data: {
                    items: [
                        { step: 'Bước 1', title: 'Thu thập dữ liệu', goal: 'Chuẩn hóa dữ liệu môn học và lớp học.' },
                        { step: 'Bước 2', title: 'Phân tích tiến độ', goal: 'Tính toán tỷ lệ hoàn thành và cảnh báo trễ.' },
                        { step: 'Bước 3', title: 'Hiển thị dashboard', goal: 'Trực quan hóa dữ liệu theo năm học.' },
                        { step: 'Bước 4', title: 'Đánh giá & điều chỉnh', goal: 'Hỗ trợ quản lý can thiệp sớm.' },
                        { step: 'Bước 5', title: 'Báo cáo tổng hợp', goal: 'Xuất báo cáo cho phòng đào tạo.' }
                    ]
                }
            },
            {
                label: 'Quy trình hoạt động',
                description: 'Giải thích cách hệ thống hoặc dịch vụ vận hành.',
                data: {
                    items: [
                        { action: 'Thu thập dữ liệu', description: 'Ghi nhận tiến độ học tập từ giảng viên.' },
                        { action: 'Xử lý & phân tích', description: 'Tự động tính toán trạng thái tiến độ.' },
                        { action: 'Cảnh báo', description: 'Phát hiện lớp hoặc môn trễ tiến độ.' },
                        { action: 'Theo dõi & điều chỉnh', description: 'Quản lý can thiệp kịp thời.' }
                    ]
                }
            },
            {
                label: 'Trước và sau khi sử dụng',
                description: 'So sánh hiệu quả để thuyết phục khách hàng.',
                data: {
                    items: [
                        { phase: 'Trước khi sử dụng', status: 'Dữ liệu rời rạc, khó theo dõi tiến độ.' },
                        { phase: 'Sau khi sử dụng', status: 'Tiến độ minh bạch, phát hiện trễ sớm.' }
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
        defaultData: { items: [{ question: 'Sản phẩm có bảo hành không?', answer: 'Có, chúng tôi bảo hành 12 tháng 1 đổi 1.' }] },
        presets: [
            {
                label: '3 Câu (Cơ bản)',
                description: 'Dạng danh sách ngắn gọn, phù hợp cho trang chủ hoặc landing page.',
                data: {
                    items: [
                        { question: 'Làm thế nào để đăng ký tài khoản?', answer: 'Bạn nhấn nút Đăng ký ở góc phải và điền thông tin email.' },
                        { question: 'Chi phí dịch vụ là bao nhiêu?', answer: 'Gói cơ bản bắt đầu từ 99k/tháng, xem chi tiết tại bảng giá.' },
                        { question: 'Có hỗ trợ kỹ thuật cuối tuần không?', answer: 'Có, đội ngũ support làm việc 24/7 kể cả ngày lễ.' }
                    ]
                }
            },
            {
                label: '5 Câu (Chi tiết)',
                description: 'Danh sách mở rộng cho trang FAQ chi tiết hoặc sản phẩm phức tạp.',
                data: { items: Array(5).fill({ question: 'Câu hỏi thường gặp?', answer: 'Câu trả lời giải đáp thắc mắc...' }) }
            }
        ]
    },
    {
        type: 'Steps',
        label: 'Steps / Process Block',
        icon: ListOrdered,
        description: 'Quy trình thực hiện',
        color: 'bg-cyan-50 text-cyan-600',
        defaultData: { items: [{ step: '01', title: 'Tư vấn', description: 'Tiếp nhận yêu cầu từ khách hàng' }] },
        presets: [
            {
                label: '3 Bước (Đơn giản)',
                description: 'Quy trình 3 bước lặp lại phổ biến (Đăng ký -> Xác nhận -> Sử dụng).',
                data: {
                    items: [
                        { step: '01', title: 'Đăng ký', description: 'Điền form thông tin trực tuyến.' },
                        { step: '02', title: 'Xác nhận', description: 'Nhân viên gọi điện xác nhận đơn hàng.' },
                        { step: '03', title: 'Nhận hàng', description: 'Giao hàng tận nơi trong 24h.' }
                    ]
                }
            },
            {
                label: '4 Bước (Quy trình)',
                description: 'Quy trình chi tiết 4 bước cho dịch vụ hoặc thi công.',
                data: {
                    items: [
                        { step: '01', title: 'Khảo sát', description: 'Đánh giá hiện trạng mặt bằng.' },
                        { step: '02', title: 'Thiết kế', description: 'Lên bản vẽ 3D chi tiết.' },
                        { step: '03', title: 'Thi công', description: 'Triển khai lắp đặt nội thất.' },
                        { step: '04', title: 'Bàn giao', description: 'Nghiệm thu và bảo hành.' }
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
            items: [
                { title: 'Giải nhất', description: 'Giải thưởng cao nhất cuộc thi', value: '3.000.000 VNĐ', highlight: true },
                { title: 'Giải nhì', description: 'Giải thưởng hạng nhì', value: '2.000.000 VNĐ', highlight: true },
                { title: 'Giải ba', description: 'Giải thưởng hạng ba', value: '1.000.000 VNĐ', highlight: true }
            ]
        },
        presets: [
            {
                label: 'Cuộc thi (Đầy đủ)',
                description: 'Bảng giải thưởng đầy đủ cho cuộc thi với giải chính và giải phụ.',
                data: {
                    items: [
                        { title: 'Giải nhất', description: 'Bao gồm tiền mặt, giấy khen và quà từ đối tác', value: '3.000.000 VNĐ', highlight: true },
                        { title: 'Giải nhì', description: 'Bao gồm tiền mặt, giấy khen và quà từ đối tác', value: '2.000.000 VNĐ', highlight: true },
                        { title: 'Giải ba', description: 'Bao gồm tiền mặt, giấy khen và quà từ đối tác', value: '1.000.000 VNĐ', highlight: true },
                        { title: 'Giải khuyến khích', description: 'Bao gồm tiền mặt và giấy khen', value: '500.000 VNĐ', multiplier: '2x' },
                        { title: 'Giải bình chọn', description: 'Bao gồm quà tặng và giấy khen', value: '500.000 VNĐ', multiplier: '3x' }
                    ]
                }
            },
            {
                label: 'Top 3 (Nhất - Nhì - Ba)',
                description: 'Chỉ hiển thị 3 giải thưởng chính, gọn gàng.',
                data: {
                    items: [
                        { title: 'Giải Nhất', description: 'Giải thưởng cao nhất', value: '100 Triệu VNĐ', highlight: true },
                        { title: 'Giải Nhì', description: 'Giải thưởng hạng nhì', value: '50 Triệu VNĐ', highlight: true },
                        { title: 'Giải Ba', description: 'Giải thưởng hạng ba', value: '20 Triệu VNĐ', highlight: true }
                    ]
                }
            },
            {
                label: 'Danh hiệu & Chứng nhận',
                description: 'Không có giá trị tiền, chỉ hiển thị tên và mô tả.',
                data: {
                    items: [
                        { title: 'Giải Sáng tạo', description: 'Dành cho ý tưởng đột phá nhất', value: '', highlight: false },
                        { title: 'Giải Cống hiến', description: 'Dành cho thành viên lâu năm', value: '', highlight: false },
                        { title: 'Giải Triển vọng', description: 'Dành cho nhân tố mới nổi bật', value: '', highlight: false }
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
        defaultData: { label: 'Click Me', link: '#', style: 'primary', size: 'medium', align: 'center' },
        presets: [
            {
                label: 'Đăng ký ngay',
                description: 'Nút nổi bật (Màu chủ đạo), kích thước lớn.',
                data: { label: 'Đăng Ký Ngay', link: '#register', style: 'primary', size: 'large', align: 'center', icon: true }
            },
            {
                label: 'Khám phá',
                description: 'Nút màu tối (Secondary), trang trọng.',
                data: { label: 'Khám Phá Ngay', link: '#explore', style: 'secondary', size: 'medium', align: 'center', icon: true }
            },
            {
                label: 'Tìm hiểu thêm',
                description: 'Nút viền (Outline), tinh tế.',
                data: { label: 'Tìm Hiểu Thêm', link: '#learn-more', style: 'outline', size: 'medium', align: 'center' }
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
