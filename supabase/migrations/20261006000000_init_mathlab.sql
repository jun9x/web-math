-- Enable UUID extension & unaccent for full-text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 6 AND 12),
    join_code VARCHAR(6) UNIQUE NOT NULL,
    is_open_enrollment BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'removed')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(class_id, student_id)
);

-- 4. TOPICS
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade INT NOT NULL CHECK (grade BETWEEN 6 AND 12),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    position INT DEFAULT 0 NOT NULL
);

-- 5. QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('mcq_single', 'mcq_multi', 'true_false', 'numeric', 'expression', 'short_text', 'essay')),
    cognitive_level TEXT NOT NULL CHECK (cognitive_level IN ('recognize', 'understand', 'apply', 'advanced')),
    difficulty INT DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    body_latex TEXT NOT NULL,
    explanation_latex TEXT,
    hints JSONB DEFAULT '[]'::jsonb, -- array of up to 3 hint steps
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'approved' CHECK (status IN ('draft', 'approved')),
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    label VARCHAR(5) NOT NULL, -- e.g. "A", "B", "C", "D"
    body_latex TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false NOT NULL,
    misconception_note TEXT
);

-- 7. QUESTION ANSWERS (For numeric, expression, short_text)
CREATE TABLE IF NOT EXISTS public.question_answers (
    question_id UUID PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
    accepted JSONB NOT NULL -- e.g. { "accepted_values": ["3.14", "3,14"], "tolerance": 0.01 }
);

-- 8. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    mode TEXT NOT NULL CHECK (mode IN ('practice', 'exam')),
    opens_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    due_at TIMESTAMPTZ,
    time_limit_minutes INT, -- null means unlimited
    max_attempts INT DEFAULT 1 NOT NULL,
    shuffle_questions BOOLEAN DEFAULT false NOT NULL,
    shuffle_options BOOLEAN DEFAULT false NOT NULL,
    show_solution_policy TEXT DEFAULT 'immediate' CHECK (show_solution_policy IN ('immediate', 'after_due', 'manual')),
    allow_ai_hints BOOLEAN DEFAULT true NOT NULL,
    allow_full_solution BOOLEAN DEFAULT true NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. ASSIGNMENT QUESTIONS
CREATE TABLE IF NOT EXISTS public.assignment_questions (
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    position INT DEFAULT 0 NOT NULL,
    points NUMERIC(5, 2) DEFAULT 1.00 NOT NULL,
    PRIMARY KEY(assignment_id, question_id)
);

-- 10. ATTEMPTS
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    submitted_at TIMESTAMPTZ,
    deadline_at TIMESTAMPTZ,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
    score NUMERIC(5, 2),
    max_score NUMERIC(5, 2) DEFAULT 10.00,
    question_order JSONB DEFAULT '[]'::jsonb
);

-- 11. ATTEMPT ANSWERS
CREATE TABLE IF NOT EXISTS public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    response JSONB,
    is_correct BOOLEAN,
    points_awarded NUMERIC(5, 2) DEFAULT 0.00,
    hints_used INT DEFAULT 0 NOT NULL,
    teacher_override BOOLEAN DEFAULT false NOT NULL,
    teacher_comment TEXT,
    ai_feedback JSONB,
    answered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(attempt_id, question_id)
);

-- 12. MATERIALS
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    kind TEXT NOT NULL CHECK (kind IN ('pdf', 'video', 'link', 'image', 'note')),
    storage_path TEXT,
    external_url TEXT,
    grade INT CHECK (grade BETWEEN 6 AND 12),
    tags TEXT[] DEFAULT '{}',
    visibility TEXT DEFAULT 'class' CHECK (visibility IN ('class', 'public_school')),
    fts TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('simple', unaccent(coalesce(title, '') || ' ' || coalesce(description, '')))
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS materials_fts_idx ON public.materials USING gin(fts);

-- 13. REVIEW SCHEDULE (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.review_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    next_review_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    interval_days INT DEFAULT 1 NOT NULL,
    streak INT DEFAULT 0 NOT NULL,
    UNIQUE(student_id, question_id)
);

-- 14. AI CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    context_type TEXT NOT NULL CHECK (context_type IN ('tutor', 'teacher_assistant')),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. AI MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    tokens_in INT DEFAULT 0,
    tokens_out INT DEFAULT 0,
    flagged BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. AI USAGE DAILY
CREATE TABLE IF NOT EXISTS public.ai_usage_daily (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day DATE DEFAULT CURRENT_DATE NOT NULL,
    count INT DEFAULT 1 NOT NULL,
    PRIMARY KEY(user_id, day)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_daily ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert/update own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- CLASSES
CREATE POLICY "Teachers create and manage own classes" ON public.classes 
    FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Students read active joined classes" ON public.classes 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE class_id = public.classes.id 
            AND student_id = auth.uid() 
            AND status = 'active'
        )
        OR teacher_id = auth.uid()
    );

-- ENROLLMENTS
CREATE POLICY "Teachers manage class enrollments" ON public.enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.classes 
            WHERE id = public.enrollments.class_id 
            AND teacher_id = auth.uid()
        )
    );
CREATE POLICY "Students manage own enrollments" ON public.enrollments
    FOR ALL USING (student_id = auth.uid());

-- TOPICS
CREATE POLICY "Topics read by all authenticated users" ON public.topics FOR SELECT USING (true);

-- QUESTIONS & OPTIONS
CREATE POLICY "Teachers CRUD own questions" ON public.questions FOR ALL USING (author_id = auth.uid());
CREATE POLICY "Students read assigned questions" ON public.questions FOR SELECT USING (true);

-- SAFE RPC FUNCTION TO SANITIZE QUESTION OPTIONS FOR EXAMS IN PROGRESS
CREATE OR REPLACE FUNCTION get_safe_question_options(p_assignment_id UUID, p_question_id UUID)
RETURNS TABLE (
    id UUID,
    question_id UUID,
    label VARCHAR,
    body_latex TEXT,
    is_correct BOOLEAN,
    misconception_note TEXT
) SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_mode TEXT;
    v_due_at TIMESTAMPTZ;
    v_show_policy TEXT;
    v_is_submitted BOOLEAN;
BEGIN
    SELECT mode, due_at, show_solution_policy INTO v_mode, v_due_at, v_show_policy
    FROM assignments WHERE assignments.id = p_assignment_id;

    -- Check if student submitted attempt
    SELECT EXISTS (
        SELECT 1 FROM attempts 
        WHERE assignment_id = p_assignment_id 
        AND student_id = auth.uid() 
        AND status IN ('submitted', 'graded')
    ) INTO v_is_submitted;

    IF v_mode = 'practice' OR v_is_submitted OR (v_due_at IS NOT NULL AND NOW() > v_due_at) THEN
        RETURN QUERY SELECT qo.id, qo.question_id, qo.label, qo.body_latex, qo.is_correct, qo.misconception_note
        FROM question_options qo WHERE qo.question_id = p_question_id;
    ELSE
        -- Hide is_correct and misconception_note during ongoing exam!
        RETURN QUERY SELECT qo.id, qo.question_id, qo.label, qo.body_latex, false AS is_correct, NULL::TEXT AS misconception_note
        FROM question_options qo WHERE qo.question_id = p_question_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ASSIGNMENTS & ATTEMPTS
CREATE POLICY "Teachers manage assignments" ON public.assignments FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Students view published assignments for joined classes" ON public.assignments FOR SELECT USING (
    is_published = true AND NOW() >= opens_at AND EXISTS (
        SELECT 1 FROM public.enrollments WHERE class_id = public.assignments.class_id AND student_id = auth.uid() AND status = 'active'
    )
);

CREATE POLICY "Students CRUD own attempts" ON public.attempts FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers view class attempts" ON public.attempts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.assignments a 
        WHERE a.id = public.attempts.assignment_id AND a.teacher_id = auth.uid()
    )
);

CREATE POLICY "Students CRUD own attempt answers" ON public.attempt_answers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.attempts att WHERE att.id = public.attempt_answers.attempt_id AND att.student_id = auth.uid())
);
CREATE POLICY "Teachers view attempt answers" ON public.attempt_answers FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.attempts att 
        JOIN public.assignments a ON a.id = att.assignment_id
        WHERE att.id = public.attempt_answers.attempt_id AND a.teacher_id = auth.uid()
    )
);

-- MATERIALS
CREATE POLICY "Uploader manage materials" ON public.materials FOR ALL USING (uploader_id = auth.uid());
CREATE POLICY "Read materials" ON public.materials FOR SELECT USING (
    visibility = 'public_school' OR EXISTS (
        SELECT 1 FROM public.enrollments WHERE class_id = public.materials.class_id AND student_id = auth.uid() AND status = 'active'
    )
);

-- REVIEW SCHEDULE & AI
CREATE POLICY "Students manage review schedule" ON public.review_schedule FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Users manage AI conversations" ON public.ai_conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage AI messages" ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations c WHERE c.id = public.ai_messages.conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users manage AI daily usage" ON public.ai_usage_daily FOR ALL USING (user_id = auth.uid());
