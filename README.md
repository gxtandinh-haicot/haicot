# Tìm Vị Trí Hài Cốt – Hướng dẫn

## Các file trong bộ

| File | Công dụng | Tải lên GitHub |
|---|---|---|
| `index.html` | Trang tra cứu: thanh tiêu đề, 3 tab, nút Mã QR | Có |
| `quan-ly.html` | Trang quản lý: nạp Excel, sửa tiêu đề, quản lý ảnh | Có |
| `style.css` | Giao diện | Có |
| `common.js` | Hàm dùng chung | Có |
| `gallery.js` | Tab Hình ảnh Nhà chờ Phục sinh | Có |
| `tuongnho.js` | Nút thắp nến, tặng hoa, thả tim, cầu nguyện | Có |
| `qr.js` | Nút Mã QR | Có |
| `README.md` | Hướng dẫn này | Không bắt buộc |
| `data.json` | Danh sách, tên giáo xứ, câu Lời Chúa | Tạo từ trang quản lý |
| `hinh-anh.json` | Ảnh Nhà chờ Phục sinh (tối đa 12) | Tạo từ trang quản lý |

`data.json` và `hinh-anh.json` là dữ liệu thật của giáo xứ, luôn lấy từ trang quản lý. Khi cập nhật giao diện, không tải đè hai file này bằng bản mẫu.

Số điện thoại luôn được che 3 số cuối (0909399***) ngay khi chuyển đổi từ Excel, nên số đầy đủ không bao giờ lên mạng.

## Đưa lên mạng lần đầu (GitHub Pages, miễn phí)

1. Tạo tài khoản tại **github.com**.
2. Bấm **+ → New repository**. Đặt tên, ví dụ `haicot`. Chọn **Public**. Bấm **Create repository**.
3. Bấm **uploading an existing file**. Kéo **7 file** đánh dấu “Có” ở bảng trên vào. Bấm **Commit changes**.
4. **Settings → Pages**: Branch `main`, thư mục `/ (root)`, bấm **Save**.
5. Sau 1–3 phút trang có địa chỉ `https://<tên-tài-khoản>.github.io/haicot/`.
6. Mở trang quản lý `…/haicot/quan-ly.html`, nạp Excel, tải `data.json` rồi tải lên kho như mục dưới.

## Cập nhật dữ liệu định kỳ

1. Xuất file Excel từ hệ thống như thường lệ.
2. Mở trang quản lý. Trang tự đọc tiêu đề, danh sách và ảnh đang có.
3. Mục 1: sửa tên giáo xứ, địa chỉ, và danh sách câu Lời Chúa nếu cần (mỗi lần mở trang hiện ngẫu nhiên một câu; chỉ để một câu thì câu đó luôn hiện).
4. Mục 2: nạp file Excel mới. Danh sách mới thay toàn bộ danh sách cũ.
5. Mục 3: bấm **Tải file data.json**. Nếu máy đặt tên `data (1).json`, đổi lại đúng `data.json`.
6. Vào kho GitHub → **Add file → Upload files** → kéo `data.json` vào (ghi đè) → **Commit changes**.
7. Sau 1–2 phút, trang hiển thị dữ liệu mới.

## Hình ảnh Nhà chờ Phục sinh

1. Trang quản lý, **mục 4**: bấm **+ Thêm ảnh** (tối đa 12). Ghi chú thích, dùng ◀ ▶ đổi thứ tự, **Xóa** để bỏ ảnh.
2. Bấm **Tải file hinh-anh.json**, rồi tải file này lên GitHub (ghi đè).
3. Ảnh HEIC của iPhone cần chuyển sang JPG trước.

## Cột Excel được nhận

STT · MÃ SỐ · NGƯỜI ĐÃ KHUẤT (gồm tên thánh) · NGÀY SINH · NGÀY MẤT · LIÊN HỆ · SỐ ĐIỆN THOẠI · ĐỊA CHỈ

Tên thánh được tự tách khỏi họ tên, ví dụ “Phêrô Nguyễn Đức Tâm” → Phêrô / Nguyễn Đức Tâm. Các dòng tiêu đề phía trên bảng được bỏ qua.

## Link mở thẳng từng tab

- Tab ngày giỗ: thêm `#gio` vào cuối địa chỉ.
- Tab hình ảnh: thêm `#anh` vào cuối địa chỉ.
- Nút **Mã QR** ở góc phải thanh tiêu đề tạo sẵn mã QR cho từng tab, tải được ảnh để in.

## Lưu ý

- Tên, người liên hệ và địa chỉ xem được công khai qua trang và qua lịch sử kho GitHub. Không bao giờ tải file Excel gốc lên kho.
- Mở `index.html` bằng cách bấm đúp trên máy tính sẽ không tải được dữ liệu. Hãy xem trên trang đã đưa lên mạng.
- Ngày giỗ tính theo dương lịch, theo cột NGÀY MẤT. Dòng chỉ ghi năm mất thì không hiện ở tab ngày giỗ.
