# Assumptions & Design Rationale (Ghi Nhận Giả Định)

1. **Chương trình Giáo dục Phổ thông 2018 (GDPT 2018)**:
   - Các cấp lớp được cấu hình linh hoạt từ Lớp 6 đến Lớp 12 trong bảng `topics` và `questions`.
   - Cây chủ đề mặc định seed các bài học tiêu biểu cho Lớp 10 và 12 và có thể mở rộng tự động.

2. **Chế độ Bài kiểm tra (Exam Mode) và Bảo mật AI**:
   - Khi bài tập có `mode = 'exam'`, nút Gia sư AI bị ẩn ở giao diện và đồng thời bị khóa bằng bảo mật server side ở `/api/ai/tutor`.
   - Học sinh không bao giờ nhận được đáp án đúng `is_correct` hoặc giải thích `explanation_latex` từ API hay HTML trong lúc bài kiểm tra đang mở.

3. **Chấm Điểm Tự Động (Grading Engine)**:
   - Không sử dụng LLM để chấm trắc nghiệm hoặc đáp án số/biểu thức nhằm bảo đảm tính chính xác 100%.
   - Dùng `mathjs` để kiểm tra tính tương đương của biểu thức đại số bằng thuật toán lấy mẫu thử ngẫu nhiên 10 điểm.
