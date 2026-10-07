# RLS Security Audit & Validation Checklist

| Bảng (Table) | Quyền Giáo Viên (Teacher) | Quyền Học Sinh (Student) | Trạng thái |
| :--- | :--- | :--- | :--- |
| `profiles` | Đọc toàn bộ, sửa profile chính mình | Đọc toàn bộ, sửa profile chính mình | ✅ Đã kiểm tra |
| `classes` | CRUD lớp học mình sở hữu | Chỉ đọc lớp mình đã tham gia (`active`) | ✅ Đã kiểm tra |
| `questions` | CRUD câu hỏi thuộc sở hữu | Đọc câu hỏi được giao | ✅ Đã kiểm tra |
| `question_options` | Đọc toàn bộ đáp án | 🔒 Trong bài `exam`, ẩn `is_correct` qua hàm RPC `get_safe_question_options` | ✅ Đã kiểm tra |
| `attempts` | Xem kết quả bài làm của các lớp mình phụ trách | CRUD bài làm của chính mình | ✅ Đã kiểm tra |
| `attempt_answers` | Xem và chấm lại bài tự luận | CRUD câu trả lời của chính mình | ✅ Đã kiểm tra |
| `ai_conversations` | 🔒 Không đọc được đoạn hội thoại riêng của học sinh | CRUD hội thoại của chính mình | ✅ Đã kiểm tra |
