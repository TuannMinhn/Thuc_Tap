import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = ({ data }) => {
    const { items = [], backgroundColor } = data || {};
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Default items
    const displayItems = items.length > 0 ? items : [
        { question: 'Câu hỏi thường gặp 1?', answer: 'Đây là câu trả lời mẫu cho câu hỏi này.' },
        { question: 'Làm thế nào để đăng ký?', answer: 'Bạn có thể đăng ký trực tuyến thông qua website của chúng tôi.' }
    ];

    return (
        <div
            className={`max-w-3xl mx-auto space-y-4 ${backgroundColor ? 'p-6 rounded-xl' : ''}`}
            style={{ backgroundColor }}
        >
            {displayItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-semibold text-gray-800">{item.question}</span>
                        {openIndex === index ? (
                            <ChevronUp size={20} className="text-blue-600" />
                        ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                        )}
                    </button>
                    {openIndex === index && (
                        <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default React.memo(FAQ);
