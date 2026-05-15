# 📋 Agile Task Manager (Kanban Board)

Một ứng dụng quản lý công việc trực quan dựa trên phương pháp Kanban, giúp người dùng theo dõi tiến độ từ **To Do**, **Doing** đến **Done**. Dự án được xây dựng hoàn toàn bằng Vanilla JavaScript, tập trung vào trải nghiệm người dùng (UX) và tối ưu hóa code theo nguyên tắc DRY.

## 🚀 Trải nghiệm ngay

👉 [Xem Demo Trực Tiếp Tại Đây](thay-link-github-pages-cua-cau-vao-day)

## ✨ Tính năng nổi bật và Điểm nhấn Kỹ thuật

- **Kéo thả thông minh (Drag & Drop):** Xử lý logic tính toán tọa độ chuột (`e.clientY`) để chèn thẻ công việc vào giữa các thẻ khác một cách chính xác, thay vì chỉ thả vào cuối cột.
- **Bộ nhớ siêu phàm (LocalStorage):** Tự động lưu toàn bộ dữ liệu (tên việc, người làm, vị trí cột) vào Local Storage bằng cấu trúc mảng JSON. Khôi phục nguyên vẹn trạng thái bảng khi tải lại trang (F5).
- **Phòng chống XSS:** Bảo mật dữ liệu đầu vào bằng cách tự đúc các thẻ DOM (`document.createElement`) và dùng `textContent`, ngăn chặn việc thực thi mã độc từ người dùng.
- **Chế độ Tối/Sáng (Dark Mode):** Giao diện linh hoạt thay đổi và ghi nhớ sở thích người dùng.
- **Tìm kiếm thời gian thực:** Lọc các thẻ công việc ngay lập tức khi gõ từ khóa.

## 🛠️ Công nghệ sử dụng

- **HTML5:** Cấu trúc ngữ nghĩa rõ ràng.
- **CSS3:** Tối ưu layout với Flexbox, sử dụng Pseudo-classes (`:not`, `:has`, `:empty`) để tự động hiển thị thông báo khi cột trống.
- **Vanilla JavaScript:** Thao tác DOM Manipulation, Event Listeners, Data Attributes (`dataset`).

## 🔮 Tính năng phát triển trong tương lai (Future Improvements)

- [ ] **Chỉnh sửa trực tiếp (Inline Editing):** Cho phép nháy đúp chuột vào thẻ để sửa nhanh tên công việc mà không cần xóa đi tạo lại.
- [ ] **Nhãn dán & Phân loại (Tags/Labels):** Thêm các thẻ màu sắc để phân loại công việc (VD: 🔴 Khẩn cấp, 🔵 Tính năng mới, 🟡 Bug).
- [ ] **Tối ưu Mobile (Responsive Design):** Cải thiện giao diện hiển thị tự động xếp chồng (stack) trên các thiết bị màn hình nhỏ (điện thoại, tablet).
- [ ] **Hạn chót (Deadlines):** Thêm ngày hết hạn cho từng công việc và cảnh báo màu đỏ khi quá hạn.
- [ ] **Lưu trữ đám mây (Cloud Database):** Tích hợp Backend (như Firebase hoặc Supabase) để đồng bộ dữ liệu trên nhiều thiết bị thay vì chỉ lưu ở LocalStorage.
