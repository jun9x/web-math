# MathLab - Nền Tảng Dạy và Học Toán GDPT 2018 (Next.js + Supabase + Gemini)

**MathLab** là giải pháp ứng dụng công nghệ giáo dục toàn diện bám sát chương trình GDPT 2018 Việt Nam, tích hợp Gia sư AI Socrates gợi mở tư duy và công cụ chấm điểm Toán học chính xác.

---

## Hướng Dẫn Chạy Cục Bộ (Local Development)

### 1. Yêu cầu hệ thống
- **Node.js**: >= 20.x
- **pnpm**: >= 9.x

### 2. Cài đặt & Chạy dự án
```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Khởi tạo file biến môi trường
cp .env.example .env.local

# 3. Chạy môi trường phát triển
pnpm dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## Hướng Dẫn Deploy Lên Vercel & Supabase

### 1. Cấu hình Supabase
1. Tạo một dự án mới tại [Supabase Dashboard](https://supabase.com).
2. Vào mục **SQL Editor**, chạy file migration `supabase/migrations/20261006000000_init_mathlab.sql`.
3. (Tùy chọn) Chạy file `supabase/seed.sql` để nạp dữ liệu câu hỏi và lớp học mẫu.
4. Tạo Storage Bucket tên `materials` và bật chế độ Email Auth trong **Authentication -> Providers**.

### 2. Lấy API Key từ Google Gemini
1. Truy cập [Google AI Studio](https://aistudio.google.com/) và tạo API Key.

### 3. Deploy lên Vercel
1. Push mã nguồn dự án lên GitHub.
2. Vào [Vercel Dashboard](https://vercel.com/) -> **Add New** -> **Project** -> **Import** repository `Web_math`.
3. Trong mục **Environment Variables**, điền đầy đủ các biến từ `.env.example`:
   - `NEXT_PUBLIC_APP_NAME`=MathLab
   - `NEXT_PUBLIC_SITE_URL`=`https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`=`https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`=`your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`=`your-service-role-key`
   - `GEMINI_API_KEY`=`your-gemini-api-key`
   - `GEMINI_MODEL`=`gemini-2.5-flash`
4. Nhấn **Deploy**. Sau khi thành công, thêm URL Vercel vào **Supabase -> Authentication -> URL Configuration**.

---

## Kiểm Thử & Đảm Bảo Chất Lượng

```bash
# Chạy Unit Test kiểm thử logic chấm điểm Toán học
pnpm test

# Kiểm tra TypeCheck và Linting
pnpm lint
pnpm build
```

---

## Tài Khoản Demo Để Kiểm Thử

- **Giáo viên**: `teacher@mathlab.edu.vn` / `123456`
- **Học sinh**: `student@mathlab.edu.vn` / `123456`
- **Mã lớp mẫu**: `MATH10`
