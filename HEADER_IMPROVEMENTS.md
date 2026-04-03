# 🎨 Header UI/UX Improvements - Tuần 5

## ✅ Đã hoàn thành

### 1. Enhanced Editor Toolbar
**Vấn đề cũ:** Toolbar che khuất nội dung, khó nhìn thấy đang edit gì

**Giải pháp mới:**
- ✅ Toolbar nổi phía trên Header (không che khuất)
- ✅ Label "HEADER" với dot animation
- ✅ Buttons rõ ràng hơn với text + icon (chỉ giữ "Chỉnh sửa", xóa "Cài đặt" và "+ Menu" thừa)
- ✅ Hover border subtle, không gây rối mắt
- ✅ Responsive: ẩn text trên mobile, chỉ giữ icon

**Code đã update:** `src/components/Layout/Header.jsx`

### 2. Hover-Only Toolbar Visibility (Toàn bộ ứng dụng)
**Vấn đề cũ:** Toolbar luôn hiển thị, gây rối mắt và che khuất nội dung

**Giải pháp mới:**
- ✅ **Header Toolbar**: Chỉ hiện khi hover vào Header
- ✅ **Footer Toolbar**: Chỉ hiện khi hover vào Footer  
- ✅ **Section Controls**: Chỉ hiện khi hover vào Section
- ✅ **Component Controls**: Chỉ hiện khi hover vào Component cụ thể

**Implementation:**
- Sử dụng Tailwind CSS `group` và `group-hover` utilities
- Pattern: `opacity-0 group-hover:opacity-100 transition-opacity`
- Nested groups: `group/comp` cho component-level controls

**Code đã update:**
- `src/components/Layout/Header.jsx` - Header toolbar
- `src/components/Layout/Footer.jsx` - Footer toolbar
- `src/components/Editor/SectionControls.jsx` - Section controls (đã có sẵn)
- `src/components/Builder/BuilderSection.jsx` - Component controls (đã có sẵn)

---

## 🚀 Cải tiến đề xuất tiếp theo

### 2. Enhanced Menu Editor với Submenu Support

**Vấn đề hiện tại:**
- Không có UI để thêm submenu trực quan
- Phải edit code để thêm children
- Không thấy được cấu trúc menu hierarchy

**Giải pháp đề xuất:**

#### A. Visual Hierarchy
```
┌─────────────────────────────────────┐
│ 📋 Menu điều hướng (3 items)        │
├─────────────────────────────────────┤
│ [≡] Trang chủ          #home    [🗑] │
├─────────────────────────────────────┤
│ [≡] Sản phẩm           #         [▼][🗑]│
│     └─ Submenu (2)                  │
│        ├─ Laptop       #laptop  [×] │
│        └─ PC           #pc      [×] │
├─────────────────────────────────────┤
│ [≡] Liên hệ            #contact [🗑] │
├─────────────────────────────────────┤
│ [+ Thêm menu chính]                 │
└─────────────────────────────────────┘
```

#### B. Features
- **Nút [▼]**: Thêm submenu cho menu item
- **Visual indent**: Submenu có indent + border-left màu xanh
- **Counter**: Hiển thị số lượng submenu
- **Drag & drop**: Sắp xếp cả menu chính và submenu
- **Collapse/Expand**: Thu gọn submenu khi không cần

#### C. Implementation
File cần update: `src/components/Editor/PropertyModal.jsx`

**Thêm state:**
```javascript
const [expandedMenus, setExpandedMenus] = useState({});
```

**Enhanced menu item:**
```jsx
<div className="space-y-2">
  {/* Main menu */}
  <div className="flex gap-2 bg-white p-3 rounded-lg">
    <input placeholder="Tên menu" />
    <input placeholder="#link" />
    <button onClick={addSubmenu}>
      <ChevronDown />
    </button>
    <button onClick={deleteMenu}>
      <Trash2 />
    </button>
  </div>
  
  {/* Submenu list */}
  {item.children?.length > 0 && (
    <div className="ml-4 pl-4 border-l-2 border-blue-200">
      <div className="text-xs text-blue-600 mb-2">
        Submenu ({item.children.length})
      </div>
      {item.children.map(child => (
        <div className="flex gap-2 bg-blue-50 p-2 rounded">
          <input value={child.label} />
          <input value={child.link} />
          <button onClick={deleteSubmenu}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
```

---

### 3. Quick Preview Mode

**Vấn đề:** Phải save và reload để xem thay đổi

**Giải pháp:**
- Thêm nút "👁 Preview" trong toolbar
- Click để toggle preview mode (tắt editor controls)
- Hotkey: `Ctrl/Cmd + P`

**Implementation:**
```javascript
const [previewMode, setPreviewMode] = useState(false);

// In toolbar
<button onClick={() => setPreviewMode(!previewMode)}>
  {previewMode ? <Edit size={16} /> : <Eye size={16} />}
  {previewMode ? 'Edit' : 'Preview'}
</button>

// Conditional render
{!previewMode && isEditing && (
  <div className="editor-toolbar">...</div>
)}
```

---

### 4. Sticky Header Settings

**Vấn đề:** Không có UI để bật/tắt sticky header

**Giải pháp:**
Thêm toggle trong PropertyModal:

```jsx
<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
  <div>
    <span className="font-medium">Sticky Header</span>
    <p className="text-xs text-gray-500">
      Header dính ở top khi scroll xuống
    </p>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={formData.enableSticky}
      onChange={(e) => handleChange('enableSticky', e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
  </label>
</div>
```

---

### 5. Search Bar Settings

**Giải pháp:**
Thêm toggle để bật/tắt search bar:

```jsx
<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
  <div>
    <span className="font-medium">Search Bar</span>
    <p className="text-xs text-gray-500">
      Thanh tìm kiếm trong header
    </p>
  </div>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={formData.enableSearch}
      onChange={(e) => handleChange('enableSearch', e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full"></div>
  </label>
</div>
```

---

### 6. Color Picker for Header

**Vấn đề:** Chỉ có text input cho màu

**Giải pháp:**
Thêm color palette như Section Settings:

```jsx
<div>
  <label className="block text-sm font-medium mb-2">Màu nền Header</label>
  <div className="grid grid-cols-6 gap-2">
    {HEADER_BG_OPTIONS.map(bg => (
      <button
        key={bg.value}
        onClick={() => {
          handleChange('backgroundColor', bg.value);
          handleChange('textColor', bg.textColor);
        }}
        className={`h-10 rounded-md border ${bg.class} ${
          formData.backgroundColor === bg.value 
            ? 'ring-2 ring-blue-500' 
            : ''
        }`}
        title={bg.label}
      />
    ))}
  </div>
</div>
```

---

### 7. Live Preview in PropertyModal

**Vấn đề:** Không thấy thay đổi real-time khi edit

**Giải pháp:**
Thêm mini preview trong PropertyModal:

```jsx
<div className="bg-gray-100 p-4 rounded-lg mb-4">
  <div className="text-xs text-gray-500 mb-2">Preview</div>
  <div className={`${formData.backgroundColor} ${formData.textColor} p-3 rounded-lg flex items-center justify-between`}>
    {formData.logo && <img src={formData.logo} className="h-8" />}
    <span className="font-bold">{formData.title}</span>
    <div className="flex gap-2 text-sm">
      {formData.menuItems?.slice(0, 3).map(item => (
        <span key={item.id}>{item.label}</span>
      ))}
    </div>
  </div>
</div>
```

---

### 8. Undo/Redo Support

**Vấn đề:** Không thể undo thay đổi

**Giải pháp:**
Implement history stack:

```javascript
const [history, setHistory] = useState([]);
const [historyIndex, setHistoryIndex] = useState(-1);

const saveToHistory = (newData) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(newData);
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};

const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setFormData(history[historyIndex - 1]);
  }
};

const redo = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setFormData(history[historyIndex + 1]);
  }
};

// Hotkeys
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [historyIndex]);
```

---

## 📊 Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Enhanced Menu Editor | 🔥 High | Medium | **P0** |
| Quick Preview Mode | High | Low | **P0** |
| Sticky/Search Toggles | Medium | Low | **P1** |
| Color Picker | Medium | Low | **P1** |
| Live Preview | High | Medium | **P1** |
| Undo/Redo | High | High | **P2** |

---

## 🎯 Next Steps

1. ✅ **Đã xong:** Enhanced Editor Toolbar
2. **Tiếp theo:** Enhanced Menu Editor với submenu support
3. **Sau đó:** Quick Preview Mode
4. **Cuối cùng:** Undo/Redo system

---

## 💡 Best Practices Applied

### UX Principles:
- ✅ **Visibility**: Editor controls rõ ràng, không che khuất
- ✅ **Feedback**: Visual indicators (dot animation, hover states)
- ✅ **Consistency**: Giống với Section editor controls
- ✅ **Efficiency**: Hotkeys và quick actions
- ✅ **Error Prevention**: Confirm dialogs cho destructive actions

### UI Principles:
- ✅ **Hierarchy**: Toolbar nổi trên, không gây rối
- ✅ **Spacing**: Padding hợp lý, không chật chội
- ✅ **Color**: Blue cho primary actions, red cho destructive
- ✅ **Typography**: Font sizes rõ ràng, readable
- ✅ **Responsive**: Mobile-friendly với hidden text

---

## 📝 Notes

- Tất cả improvements đều backward compatible
- Không breaking changes với code hiện tại
- Có thể implement từng phần một
- Test trên cả desktop và mobile

