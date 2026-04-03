# 📖 Hệ Thống Preview + Detail Pages

## 🎯 Tổng quan

Hệ thống mới cho phép tạo **Landing Page với Preview Cards** và **Detail Pages với nội dung đầy đủ**.

### Cách hoạt động:

1. **Landing Page (/)**: Hiển thị preview cards của các sections
2. **Detail Pages (/{sectionId})**: Hiển thị nội dung chi tiết đầy đủ
3. **Menu Header**: Tự động sync với các sections

---

## 📁 Cấu trúc Files

```
src/
├── pages/
│   ├── LandingPage.jsx          # Trang chủ với preview cards
│   └── SectionDetailPage.jsx    # Template cho detail pages
├── components/
│   └── Content/
│       └── SectionPreview.jsx   # Component preview card
└── data/
    ├── landingPageConfig.js     # Config chính
    └── sectionDataExample.js    # Ví dụ data structure
```

---

## 🔧 Cách sử dụng

### 1. Thêm Preview cho Section

Trong `landingPageConfig.js`, thêm field `preview`:

```javascript
{
    id: "dao-tao",
    
    // Preview - Hiển thị trên landing page
    preview: {
        title: "Chương Trình Đào Tạo",
        subtitle: "Đào tạo chất lượng cao",
        description: "Mô tả ngắn gọn 2-3 dòng...",
        image: "https://...",
        icon: "🎓",
        ctaText: "Xem chi tiết",
        ctaLink: "/dao-tao"
    },
    
    // Detail - Hiển thị trên detail page
    detail: {
        hero: {
            title: "Chương Trình Đào Tạo",
            subtitle: "Mô tả chi tiết hơn..."
        },
        additionalContent: `
            <h2>Tiêu đề</h2>
            <p>Nội dung HTML đầy đủ...</p>
        `,
        relatedSections: ["tuyen-sinh", "faq"],
        cta: {
            text: "Đăng ký ngay",
            link: "#lien-he"
        }
    },
    
    // Layout và components như cũ
    layout: "3-col",
    columns: [...]
}
```

### 2. Section KHÔNG có Preview

Sections không có `preview` sẽ hiển thị **full content** trên landing page:

```javascript
{
    id: "thong-ke",
    // KHÔNG CÓ preview field
    
    layout: "4-col",
    columns: [...]
}
```

**Ví dụ sections nên hiển thị full:**
- Hero section
- Stats section
- Timeline
- FAQ

---

## 🎨 Preview Card Structure

```javascript
preview: {
    title: "Tiêu đề chính",           // Required
    subtitle: "Phụ đề",               // Optional
    description: "Mô tả 2-3 dòng",    // Required
    image: "URL ảnh",                 // Optional
    icon: "🎓",                       // Optional (emoji)
    ctaText: "Xem chi tiết",          // Optional (default: "Xem chi tiết")
    ctaLink: "/section-id"            // Optional (default: "/{id}")
}
```

---

## 📄 Detail Page Structure

```javascript
detail: {
    // Hero section ở đầu detail page
    hero: {
        title: "Tiêu đề lớn",
        subtitle: "Mô tả chi tiết"
    },
    
    // Nội dung HTML bổ sung (sau phần components)
    additionalContent: `
        <h2>Heading</h2>
        <p>Paragraph...</p>
        <ul><li>List item</li></ul>
    `,
    
    // Sections liên quan (hiển thị ở cuối)
    relatedSections: ["section-id-1", "section-id-2"],
    
    // Sticky CTA button (góc dưới phải)
    cta: {
        text: "Liên hệ ngay",
        link: "#lien-he"
    }
}
```

---

## 🚀 Routing

| URL | Page | Mô tả |
|-----|------|-------|
| `/` | LandingPage | Trang chủ với preview cards |
| `/dao-tao` | SectionDetailPage | Chi tiết chương trình đào tạo |
| `/tuyen-sinh` | SectionDetailPage | Chi tiết tuyển sinh |
| `/editor` | PageBuilder | Editor mode (như cũ) |
| `/dashboard` | Dashboard | Admin dashboard |

---

## 💡 Best Practices

### Preview Content:
- ✅ Ngắn gọn, súc tích (2-3 dòng)
- ✅ Highlight điểm nổi bật
- ✅ CTA rõ ràng
- ❌ Không quá dài dòng
- ❌ Không duplicate với detail

### Detail Content:
- ✅ Đầy đủ, chi tiết
- ✅ Có structure rõ ràng (headings, lists)
- ✅ Có related sections
- ✅ Có CTA cuối trang
- ❌ Không copy/paste từ preview

---

## 🔄 Migration từ hệ thống cũ

### Bước 1: Xác định sections nào cần preview

**Cần preview:**
- Giới thiệu
- Đào tạo
- Tuyển sinh
- Liên hệ

**KHÔNG cần preview (hiển thị full):**
- Hero
- Stats
- Timeline
- FAQ

### Bước 2: Thêm preview data

Thêm field `preview` vào sections cần thiết.

### Bước 3: Thêm detail data (optional)

Nếu muốn trang chi tiết có thêm nội dung, thêm field `detail`.

### Bước 4: Test

1. Vào `/` - Xem landing page
2. Click vào preview card - Xem detail page
3. Check breadcrumb, related sections, CTA

---

## 🎯 Ví dụ hoàn chỉnh

Xem file `src/data/landingPageConfig.js` - sections:
- `dao-tao` - Có preview + detail đầy đủ
- `tuyen-sinh` - Có preview + detail đầy đủ
- `thong-ke` - Không có preview (hiển thị full)

---

## 📞 Support

Nếu có vấn đề, check:
1. Section có `preview` field chưa?
2. `preview.title` và `preview.description` có giá trị chưa?
3. Routing có đúng không? (URL phải match với section.id)
4. Related sections có tồn tại không?

---

## 🚀 Next Steps

- [ ] Thêm preview cho các sections còn lại
- [ ] Customize detail page layout
- [ ] Add SEO meta tags cho detail pages
- [ ] Add analytics tracking
