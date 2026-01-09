import React, { useState } from 'react';
import { Type, Image, X, Video, Hash, Clock, HelpCircle, ListOrdered, Award, ChevronDown, ChevronUp, LayoutTemplate } from 'lucide-react';
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
                label: 'Section Title',
                description: 'Dùng để ngăn cách các phần nội dung lớn.',
                data: {
                    title: '',
                    content: '',
                    align: 'left',
                    instruction: 'Dùng để ngăn cách các phần nội dung lớn. Hãy nhập tiêu đề chính vào đây.'
                }
            },
            {
                label: 'Title + Description',
                description: 'Cấu trúc tiêu chuẩn với tiêu đề và đoạn văn mô tả chi tiết.',
                data: {
                    title: '',
                    content: '',
                    instruction: 'Cấu trúc tiêu chuẩn: Nhập tiêu đề và đoạn văn mô tả chi tiết phía dưới.'
                }
            },
            {
                label: 'Title + Subtitle',
                description: 'Nhấn mạnh tiêu đề chính kèm dòng phụ chú nhỏ.',
                data: {
                    title: '',
                    subtitle: '',
                    content: '',
                    instruction: 'Nhấn mạnh tiêu đề chính kèm dòng phụ chú nhỏ (Subtitle) để làm rõ ý nghĩa.'
                }
            },
            {
                label: 'Centered Intro',
                description: 'Thu hút sự chú ý, tối ưu cho lời chào hoặc thông điệp chính.',
                data: {
                    title: '',
                    content: '',
                    align: 'center',
                    instruction: 'Thu hút sự chú ý. Tối ưu cho lời chào hoặc thông điệp chính của trang.'
                }
            },
            {
                label: 'Paragraph Only',
                description: 'Đoạn văn đơn thuần, thích hợp cho ghi chú hoặc footer.',
                data: {
                    title: '',
                    content: '',
                    instruction: 'Đoạn văn đơn thuần. Thích hợp cho các ghi chú, mô tả bổ sung hoặc chân trang.'
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
                label: 'Highlight Metrics (1)',
                description: 'Tập trung vào một con số ấn tượng nhất.',
                data: {
                    items: [
                        { value: 'Top #1', label: 'Thị phần Việt Nam', description: 'Được bình chọn bởi người dùng 2024.' }
                    ]
                }
            },
            {
                label: '3 Metrics – Horizontal',
                description: 'Bố cục 3 cột cân đối.',
                data: {
                    items: [
                        { value: '500+', label: 'Dự án' },
                        { value: '98%', label: 'Hài lòng' },
                        { value: '10 Năm', label: 'Kinh nghiệm' }
                    ]
                }
            },
            {
                label: '4 Metrics – Grid',
                description: 'Lưới 4 chủ đề cho desktop.',
                data: {
                    items: [
                        { value: '10K', label: 'Học viên' },
                        { value: '50+', label: 'Khóa học' },
                        { value: '30+', label: 'Giảng viên' },
                        { value: '100%', label: 'Cam kết' }
                    ]
                }
            },
            {
                label: 'Stats with Description',
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
            { label: 'Full Width', data: { src: '', alt: 'Banner', aspectRatio: 'aspect-video', fullWidth: true, caption: '' } },
            { label: 'Banner Hero', data: { src: '', alt: 'Hero', aspectRatio: 'aspect-[21/9]', caption: 'Chào mừng đến với website' } },
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
            { label: 'Video Center', data: { type: 'video', src: '', align: 'center', caption: 'Xem video để hiểu rõ hơn về chúng tôi' } },
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
                label: '3 Mốc (Lịch sử)',
                data: {
                    items: [
                        { date: '2020', title: 'Thành lập', description: 'Bắt đầu với đội ngũ 5 thành viên.' },
                        { date: '2022', title: 'Mở rộng', description: 'Đạt mốc 100 khách hàng đầu tiên.' },
                        { date: '2024', title: 'Bứt phá', description: 'Ra mắt sản phẩm chủ lực 2.0.' }
                    ]
                }
            },
            {
                label: '5 Mốc (Lộ trình)',
                data: {
                    items: [
                        { date: 'Q1', title: 'Nghiên cứu', description: 'Phân tích thị trường và nhu cầu.' },
                        { date: 'Q2', title: 'Thiết kế', description: 'Xây dựng bản mẫu concept.' },
                        { date: 'Q3', title: 'Phát triển', description: 'Lập trình tính năng cốt lõi.' },
                        { date: 'Q4', title: 'Thử nghiệm', description: 'Beta test với người dùng.' },
                        { date: 'Launch', title: 'Ra mắt', description: 'Chính thức công bố sản phẩm.' }
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
        description: 'Giải thưởng, chứng nhận',
        color: 'bg-pink-50 text-pink-600',
        defaultData: { items: [{ title: 'Chứng nhận ISO', subtitle: '9001:2015', icon: 'award' }] },
        presets: [
            {
                label: 'Top 3 (Nhất - Nhì - Ba)',
                data: {
                    items: [
                        { title: 'Giải Nhất', subtitle: '100 Triệu VNĐ', icon: 'trophy' },
                        { title: 'Giải Nhì', subtitle: '50 Triệu VNĐ', icon: 'award' },
                        { title: 'Giải Ba', subtitle: '20 Triệu VNĐ', icon: 'star' }
                    ]
                }
            },
            {
                label: 'Danh sách giải (Dọc)',
                data: {
                    items: [
                        { title: 'Giải Sáng tạo', subtitle: 'Dành cho ý tưởng đột phá', icon: 'star' },
                        { title: 'Giải Cống hiến', subtitle: 'Dành cho thành viên lâu năm', icon: 'award' },
                        { title: 'Giải Triển vọng', subtitle: 'Dành cho nhân tố mới', icon: 'award' }
                    ]
                }
            }
        ]
    }
];

const ComponentPickerModal = ({ isOpen, onClose, onSelect }) => {
    useLockBodyScroll(isOpen);
    const [expandedType, setExpandedType] = useState(null);

    // Reset expanded state when modal closes
    React.useEffect(() => {
        if (!isOpen) setExpandedType(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTypeClick = (item) => {
        if (expandedType === item.type) {
            setExpandedType(null); // Toggle off
        } else {
            setExpandedType(item.type); // Expand
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden zoom-in-95 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50 shrink-0">
                    <h3 className="font-bold text-lg text-gray-800">Chọn thành phần</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0">
                    <div className="p-4 grid gap-3">
                        {COMPONENT_TYPES.map((item) => {
                            const Icon = item.icon;
                            const isExpanded = expandedType === item.type;
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
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500 relative group/info shrink-0">
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
