import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = ({ data }) => {
    const {
        blockTitle = 'Liên hệ với chúng tôi',
        blockSubtitle = 'Gửi tin nhắn và chúng tôi sẽ phản hồi sớm nhất',
        showContactInfo = true,
        contactInfo = {
            email: 'contact@example.com',
            phone: '(+84) 123 456 789',
            address: '123 Đường ABC, Quận 1, TP.HCM'
        },
        backgroundColor,
        formFields = ['name', 'email', 'phone', 'message']
    } = data || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formFields.includes('name') && !formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (formFields.includes('email')) {
            if (!formData.email.trim()) {
                newErrors.email = 'Vui lòng nhập email';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }

        if (formFields.includes('phone') && formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (formFields.includes('message') && !formData.message.trim()) {
            newErrors.message = 'Vui lòng nhập nội dung';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Simulate form submission
        setStatus('loading');
        
        setTimeout(() => {
            setStatus('success');
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Clear success message after 5s
            setTimeout(() => setStatus(null), 5000);
        }, 1000);
    };

    return (
        <div className="py-16" style={{ backgroundColor }}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    {blockTitle && (
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {blockTitle}
                        </h2>
                    )}
                    {blockSubtitle && (
                        <p className="text-xl text-gray-600">
                            {blockSubtitle}
                        </p>
                    )}
                </div>

                <div className={`grid gap-12 ${showContactInfo ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Contact Info */}
                    {showContactInfo && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Thông tin liên hệ
                                </h3>
                                <p className="text-gray-600 mb-8">
                                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây.
                                </p>
                            </div>

                            {/* Contact Items */}
                            <div className="space-y-6">
                                {contactInfo.email && (
                                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <Mail size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                            <a 
                                                href={`mailto:${contactInfo.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {contactInfo.phone && (
                                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-green-100 p-3 rounded-lg">
                                            <Phone size={24} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Điện thoại</h4>
                                            <a 
                                                href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`}
                                                className="text-green-600 hover:underline"
                                            >
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {contactInfo.address && (
                                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <MapPin size={24} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Địa chỉ</h4>
                                            <p className="text-gray-600">
                                                {contactInfo.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact Form */}
                    <div className={`bg-white rounded-2xl shadow-xl p-8 ${!showContactInfo ? 'max-w-2xl mx-auto w-full' : ''}`}>
                        {status === 'success' ? (
                            <div className="text-center py-12">
                                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Gửi thành công!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.
                                </p>
                                <button
                                    onClick={() => setStatus(null)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Gửi tin nhắn khác
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                {formFields.includes('name') && (
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Nguyễn Văn A"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Email */}
                                {formFields.includes('email') && (
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Phone */}
                                {formFields.includes('phone') && (
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="0123 456 789"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Subject */}
                                {formFields.includes('subject') && (
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Vấn đề cần hỗ trợ"
                                        />
                                    </div>
                                )}

                                {/* Message */}
                                {formFields.includes('message') && (
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nội dung <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                                errors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} />
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    aria-label="Gửi tin nhắn"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ContactForm);
