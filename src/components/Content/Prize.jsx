import React from 'react';
import { Award, Star, Trophy } from 'lucide-react';

const Prize = ({ data }) => {
    const { items = [], style = {} } = data || {};
    const {
        iconColor = 'text-yellow-500',
        cardBg = 'bg-white',
        textColor = 'text-gray-800'
    } = style;

    // Default items (Rule: Keep it short, max 3-4 items for landing page)
    const displayItems = items.length > 0 ? items : [
        { title: 'Huân chương Lao động', subtitle: 'Hạng Ba (2020)', icon: 'award' },
        { title: 'Top 10 Đại học', subtitle: 'Công nghệ tốt nhất', icon: 'trophy' },
        { title: 'Kiểm định AUN-QA', subtitle: 'Đạt chuẩn quốc tế', icon: 'star' },
    ];

    const getIcon = (name) => {
        switch (name) {
            case 'trophy': return <Trophy size={40} className={iconColor} />;
            case 'star': return <Star size={40} className={iconColor} />;
            default: return <Award size={40} className={iconColor} />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-6">
            {displayItems.map((item, index) => (
                <div key={index} className={`${cardBg} p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300`}>
                    <div className="mb-4 p-3 bg-yellow-50 rounded-full">
                        {getIcon(item.icon)}
                    </div>
                    {/* Hierarchy: Title > Subtitle (No long content) */}
                    <h3 className={`text-lg font-bold ${textColor} mb-1.5`}>{item.title}</h3>
                    <p className="text-gray-500 font-medium text-sm">{item.subtitle}</p>
                </div>
            ))}
        </div>
    );
};

export default Prize;
