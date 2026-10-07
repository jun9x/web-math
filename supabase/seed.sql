-- 0. Seed Auth Users into auth.users table (password: 123456)
INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'teacher@mathlab.edu.vn',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Thầy Nguyễn Văn Toán (Toán Lớp 8)", "role": "teacher"}'::jsonb,
    NOW(),
    NOW()
),
(
    'e0000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student@mathlab.edu.vn',
    crypt('123456', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Học sinh Trần Bình An (Lớp 8A1)", "role": "student"}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 1. Seed GDPT 2018 Grade 8 Topics (Chương trình Toán Lớp 8)
INSERT INTO public.topics (id, grade, name, slug, position) VALUES
('08000000-0000-0000-0000-000000000001', 8, 'Đa thức nhiều biến & Các phép toán', 'da-thuc-nhieu-bien', 1),
('08000000-0000-0000-0000-000000000002', 8, 'Các Hằng đẳng thức đáng nhớ', 'hang-dang-thuc-dang-nho', 2),
('08000000-0000-0000-0000-000000000003', 8, 'Phân thức đại số', 'phan-thuc-dai-so', 3),
('08000000-0000-0000-0000-000000000004', 8, 'Hàm số bậc nhất y = ax + b', 'ham-so-bac-nhat', 4),
('08000000-0000-0000-0000-000000000005', 8, 'Phương trình bậc nhất một ẩn', 'phuong-trinh-bac-nhat', 5),
('08000000-0000-0000-0000-000000000006', 8, 'Tứ giác & Các hình tứ giác đặc biệt', 'tu-giac', 6),
('08000000-0000-0000-0000-000000000007', 8, 'Định lí Thalès trong tam giác', 'dinh-li-thales', 7),
('08000000-0000-0000-0000-000000000008', 8, 'Tam giác đồng dạng', 'tam-giac-dong-dang', 8),
('08000000-0000-0000-0000-000000000009', 8, 'Hình chóp tam giác đều & Hình chóp tứ giác đều', 'hinh-chop-deu', 9),
('08000000-0000-0000-0000-000000000010', 8, 'Thu thập và Phân tích dữ liệu thống kê', 'thong-ke-du-lieu', 10)
ON CONFLICT (id) DO NOTHING;

-- 2. Demo Profiles
INSERT INTO public.profiles (id, full_name, role) VALUES
('e0000000-0000-0000-0000-000000000001', 'Thầy Nguyễn Văn Toán (Toán Lớp 8)', 'teacher'),
('e0000000-0000-0000-0000-000000000002', 'Học sinh Trần Bình An (Lớp 8A1)', 'student'),
('e0000000-0000-0000-0000-000000000003', 'Học sinh Lê Minh Khoa (Lớp 8A1)', 'student'),
('e0000000-0000-0000-0000-000000000004', 'Học sinh Phạm Thu Thảo (Lớp 8A1)', 'student'),
('e0000000-0000-0000-0000-000000000005', 'Học sinh Hoàng Đức Anh (Lớp 8A1)', 'student'),
('e0000000-0000-0000-0000-000000000006', 'Học sinh Vũ Phương Nhi (Lớp 8A1)', 'student')
ON CONFLICT (id) DO NOTHING;

-- 3. Demo Grade 8 Class
INSERT INTO public.classes (id, teacher_id, name, grade, join_code, is_open_enrollment) VALUES
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Lớp Toán 8A1 - GDPT 2018', 8, 'MATH08', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Enrollments
INSERT INTO public.enrollments (class_id, student_id, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'active'),
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'active'),
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'active'),
('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'active'),
('c0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000006', 'active')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- 5. Demo Grade 8 Questions
INSERT INTO public.questions (id, author_id, topic_id, type, cognitive_level, difficulty, body_latex, explanation_latex, hints, status, source) VALUES
('q0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '08000000-0000-0000-0000-000000000002', 'mcq_single', 'recognize', 1, 'Khai triển hằng đẳng thức $(x + 3)^2$ ta được kết quả nào sau đây?', 'Áp dụng hằng đẳng thức bình phương của một tổng $(a+b)^2 = a^2 + 2ab + b^2$. Với $a=x, b=3$, ta có $(x+3)^2 = x^2 + 2\\cdot x \\cdot 3 + 3^2 = x^2 + 6x + 9$.', '["Áp dụng công thức $(a+b)^2 = a^2 + 2ab + b^2$", "Thay $a = x$ và $b = 3$", "Tính $2 \\cdot x \\cdot 3 = 6x$ và $3^2 = 9$"]'::jsonb, 'approved', 'manual'),
('q0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', '08000000-0000-0000-0000-000000000005', 'numeric', 'understand', 2, 'Giải phương trình bậc nhất một ẩn: $2x - 8 = 0$. Giá trị của $x$ là bao nhiêu?', 'Chuyển $-8$ sang vế phải thành $8$, ta được $2x = 8 \\Rightarrow x = 8 / 2 = 4$.', '["Chuyển số hạng tự do $-8$ sang vế phải", "Ta có $2x = 8$", "Chia cả 2 vế cho 2 để tìm $x$"]'::jsonb, 'approved', 'manual'),
('q0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'expression', 'apply', 3, 'Rút gọn biểu thức hằng đẳng thức: $A = (x + 2)^2 - (x - 2)^2$.', 'Khai triển: $A = (x^2 + 4x + 4) - (x^2 - 4x + 4) = x^2 + 4x + 4 - x^2 + 4x - 4 = 8x$.', '["Khai triển hai hằng đẳng thức $(a+b)^2$ và $(a-b)^2$", "Mở dấu ngoặc lưu ý đổi dấu phép trừ", "Thực hiện rút gọn các hạng tử đồng dạng"]'::jsonb, 'approved', 'manual'),
('q0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 'numeric', 'apply', 3, 'Cho hàm số bậc nhất $y = 3x - 5$. Tính giá trị của $y$ tại $x = 4$.', 'Thay $x = 4$ vào công thức hàm số: $y = 3(4) - 5 = 12 - 5 = 7$.', '["Thay $x = 4$ vào biểu thức $y = 3x - 5$", "Thực hiện phép tính $3 \\cdot 4 = 12$", "Tính $12 - 5 = 7$"]'::jsonb, 'approved', 'manual')
ON CONFLICT (id) DO NOTHING;

-- 6. Demo Question Options for Grade 8
INSERT INTO public.question_options (id, question_id, label, body_latex, is_correct, misconception_note) VALUES
('o0000000-0000-0000-0000-000000000001', 'q0000000-0000-0000-0000-000000000001', 'A', '$x^2 + 6x + 9$', true, NULL),
('o0000000-0000-0000-0000-000000000002', 'q0000000-0000-0000-0000-000000000001', 'B', '$x^2 + 9$', false, 'Lỗi quên số hạng tích $2ab$ ở giữa'),
('o0000000-0000-0000-0000-000000000003', 'q0000000-0000-0000-0000-000000000001', 'C', '$x^2 + 3x + 9$', false, 'Lỗi nhầm $2ab$ thành $ab$'),
('o0000000-0000-0000-0000-000000000004', 'q0000000-0000-0000-0000-000000000001', 'D', '$x^2 - 6x + 9$', false, 'Lỗi nhầm dấu của $(a+b)^2$ thành $(a-b)^2$')
ON CONFLICT (id) DO NOTHING;

-- 7. Demo Question Answers
INSERT INTO public.question_answers (question_id, accepted) VALUES
('q0000000-0000-0000-0000-000000000002', '{"accepted_values": ["4", "4.0"], "tolerance": 0.001}'::jsonb),
('q0000000-0000-0000-0000-000000000003', '{"target_expression": "8*x", "variables": ["x"]}'::jsonb),
('q0000000-0000-0000-0000-000000000004', '{"accepted_values": ["7", "7.0"], "tolerance": 0.001}'::jsonb)
ON CONFLICT (question_id) DO NOTHING;

-- 8. Demo Grade 8 Assignments
INSERT INTO public.assignments (id, class_id, teacher_id, title, description, mode, opens_at, due_at, time_limit_minutes, max_attempts, show_solution_policy, allow_ai_hints, is_published) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Bài Luyện Tập: Hằng đẳng thức & Hàm số bậc nhất (Lớp 8)', 'Luyện tập củng cố kiến thức hằng đẳng thức đáng nhớ và hàm số bậc nhất.', 'practice', NOW(), NOW() + INTERVAL '14 days', NULL, 5, 'immediate', true, true),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Bài Kiểm Tra 15 Phút - Toán Lớp 8 Giữa Kỳ', 'Kiểm tra đánh giá năng lực Toán 8. Gia sư AI bị khóa trong suốt quá trình làm bài.', 'exam', NOW(), NOW() + INTERVAL '7 days', 15, 1, 'after_due', false, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Demo Assignment Questions
INSERT INTO public.assignments_questions (assignment_id, question_id, position, points) VALUES
('a0000000-0000-0000-0000-000000000001', 'q0000000-0000-0000-0000-000000000001', 1, 3.0),
('a0000000-0000-0000-0000-000000000001', 'q0000000-0000-0000-0000-000000000002', 2, 3.5),
('a0000000-0000-0000-0000-000000000001', 'q0000000-0000-0000-0000-000000000003', 3, 3.5),
('a0000000-0000-0000-0000-000000000002', 'q0000000-0000-0000-0000-000000000001', 1, 5.0),
('a0000000-0000-0000-0000-000000000002', 'q0000000-0000-0000-0000-000000000004', 2, 5.0)
ON CONFLICT (assignment_id, question_id) DO NOTHING;
