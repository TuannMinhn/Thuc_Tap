export const REPORT_TEMPLATE = [
    {
        id: "section-header",
        layout: "1-col",
        style: { padding: "py-10", backgroundColor: "bg-white" },
        columns: [
            {
                id: "col-header",
                components: [
                    {
                        id: "comp-title",
                        type: "RichText",
                        data: {
                            title: "BÁO CÁO CÔNG VIỆC TUẦN [SỐ THỨ TỰ]",
                            subtitle: "Họ và tên: .................... | Vị trí: ....................",
                            content: "Thời gian: Từ ngày .../... đến ngày .../...",
                            align: "text-center",
                            titleStyle: { preset: "h1" },
                            subtitleStyle: { preset: 'h3', italic: true }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "section-summary",
        layout: "1-col",
        style: { padding: "py-8", backgroundColor: "bg-blue-50" },
        columns: [
            {
                id: "col-summary",
                components: [
                    {
                        id: "comp-summary-title",
                        type: "RichText",
                        data: {
                            title: "I. Tổng Kết Công Việc",
                            align: "text-left",
                            titleStyle: { preset: "h2", size: "text-xl" }
                        }
                    },
                    {
                        id: "comp-timeline",
                        type: "Timeline",
                        data: {
                            style: { lineColor: "bg-blue-300", dotColor: "bg-blue-600" },
                            items: [
                                {
                                    date: "100%",
                                    title: "Tìm hiểu tài liệu dự án A",
                                    description: "Nắm rõ quy trình triển khai."
                                },
                                {
                                    date: "80%",
                                    title: "Thiết kế giao diện trang chủ",
                                    description: "Hoàn thành bản thảo trên Figma."
                                },
                                {
                                    date: "Pending",
                                    title: "Nhiệm vụ khác...",
                                    description: "Đang chờ feedback."
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "section-issues",
        layout: "2-col",
        style: { padding: "py-8", backgroundColor: "bg-white" },
        columns: [
            {
                id: "col-issues",
                components: [
                    {
                        id: "comp-issues",
                        type: "RichText",
                        data: {
                            title: "II. Vấn đề & Khó khăn",
                            content: "• Chưa hiểu rõ cách sử dụng phần mềm X.\n• Cần thêm dữ liệu về khách hàng.",
                            align: "text-left",
                            contentStyle: { preset: "body" }
                        }
                    }
                ]
            },
            {
                id: "col-proposals",
                components: [
                    {
                        id: "comp-proposals",
                        type: "RichText",
                        data: {
                            title: "III. Đề xuất & Kiến nghị",
                            content: "• Mong muốn được hướng dẫn thêm về kỹ năng content.\n• Xin phép tham gia buổi họp kỹ thuật tuần tới.",
                            align: "text-left",
                            contentStyle: { preset: "body" }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: "section-plan",
        layout: "1-col",
        style: { padding: "py-10", backgroundColor: "bg-gray-50" },
        columns: [
            {
                id: "col-plan",
                components: [
                    {
                        id: "comp-plan-title",
                        type: "RichText",
                        data: {
                            title: "IV. Kế hoạch tuần tiếp theo",
                            align: "text-center",
                            titleStyle: { preset: "h2" }
                        }
                    },
                    {
                        id: "comp-steps",
                        type: "Steps",
                        data: {
                            items: [
                                { step: "1", title: "Hoàn thiện", description: "Các công việc còn dang dở của tuần này." },
                                { step: "2", title: "Triển khai mới", description: "Bắt đầu thực hiện nhiệm vụ [Tên nhiệm vụ]." },
                                { step: "3", title: "Nghiên cứu", description: "Tìm hiểu về chủ đề mới." }
                            ]
                        }
                    }
                ]
            }
        ]
    }
];
