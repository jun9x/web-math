"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MathRenderer } from "@/components/math/MathRenderer";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  RefreshCw, 
  MessageSquare,
  GraduationCap,
  Calculator,
  ShieldCheck,
  Zap,
  PlusCircle,
  FileQuestion,
  Wand2
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export default function TeacherAiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Kính chào Thầy/Cô! Em là **Trợ Lý AI Hỗ Trợ Giảng Dạy Toán Lớp 8 (GDPT 2018)**. 👨‍🏫\n\nEm có thể giúp Thầy/Cô các công việc:\n- 📝 *Soạn thảo giáo án & Đề bài kiểm tra theo 4 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)*\n- 🔍 *Gợi ý bài tập phân hóa theo năng lực học sinh*\n- 💡 *Viết lời giải chi tiết chuẩn định dạng LaTeX*\n\nThầy/Cô cần hỗ trợ nội dung gì hôm nay ạ?",
      timestamp: "Vừa xong",
      suggestedActions: [
        { label: "Soạn 3 câu hỏi Hằng đẳng thức mức Vận dụng", action: "Soạn 3 câu hỏi Hằng đẳng thức mức Vận dụng có lời giải LaTeX" },
        { label: "Gợi ý giáo án 15 phút về Phương trình bậc nhất", action: "Gợi ý khung giáo án 15 phút ôn tập Phương trình bậc nhất 1 ẩn" },
        { label: "Tạo bài tập thực tế về Hàm số y = ax + b", action: "Cho 2 bài tập ứng dụng thực tế Toán 8 về hàm số bậc nhất" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Soạn đề bài");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/teacher/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName: "Toán Lớp 8",
          cognitiveLevel: "apply",
          count: 1,
          customPrompt: query,
        }),
      });

      if (!res.ok) {
        // Fallback response for local demo mode
        setTimeout(() => {
          generateFallbackTeacherAiResponse(query);
          setLoading(false);
        }, 800);
        return;
      }

      const data = await res.json();
      const aiResponseText = data.text || "Đã tạo xong nội dung câu hỏi.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    } catch (err) {
      generateFallbackTeacherAiResponse(query);
      setLoading(false);
    }
  };

  const generateFallbackTeacherAiResponse = (userQuery: string) => {
    let reply = "";
    let actions: { label: string; action: string }[] = [];

    const lower = userQuery.toLowerCase();
    if (lower.includes("hằng đẳng thức") || lower.includes("soạn")) {
      reply = `### 📝 Gợi ý câu hỏi GDPT 2018 (Hằng đẳng thức đáng nhớ)\n\n**Câu 1 (Mức độ Vận dụng):**\nCho biểu thức $A = (x + 3)^2 - (x - 3)^2$. Rút gọn $A$ và tính giá trị tại $x = \\frac{1}{2}$.\n\n**Lời giải chi tiết:**\n- Khai triển: $A = (x^2 + 6x + 9) - (x^2 - 6x + 9) = 12x$.\n- Thay $x = \\frac{1}{2}$: $A = 12 \\cdot \\frac{1}{2} = 6$.\n\n*Thầy/Cô có muốn thêm câu hỏi này trực tiếp vào Ngân hàng câu hỏi không ạ?*`;
      actions = [
        { label: "➕ Lưu vào Ngân hàng câu hỏi", action: "Đã lưu câu hỏi này vào ngân hàng thành công!" },
        { label: "🔄 Tạo thêm 1 câu tương tự", action: "Soạn thêm 1 câu tương tự bài vừa rồi" },
      ];
    } else if (lower.includes("giáo án") || lower.includes("khung")) {
      reply = `### 📋 Khung Hoạt Động Ôn Tập 15 Phút (Toán Lớp 8)\n\n1. **Khởi động (3 phút):** Trắc nghiệm nhanh 3 câu công thức Hằng đẳng thức.\n2. **Luyện tập nhóm (8 phút):** Giải phương trình $2x - 8 = 0$ và bài toán thực tế.\n3. **Củng cố (4 phút):** Học sinh nháp lời giải lên hệ thống MathLab.\n\n*Trợ lý AI đã tối ưu khung thời gian bám sát chương trình GDPT 2018.*`;
      actions = [
        { label: "Xuất file Bài tập cho lớp 8A1", action: "Tạo bài tập tự động cho Lớp 8A1 từ khung này" },
      ];
    } else {
      reply = `Em đã ghi nhận yêu cầu của Thầy/Cô! ✨\n\nNội dung đã được định dạng chuẩn **LaTeX** để Thầy/Cô có thể dễ dàng copy vào đề thi hoặc hệ thống quản lý lớp học.\n\nThầy/Cô cần em tinh chỉnh thêm thông số nào không ạ?`;
      actions = [
        { label: "Soạn thêm đề trắc nghiệm 4 lựa chọn", action: "Soạn đề trắc nghiệm chọn 1 đáp án" },
      ];
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: actions,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/teacher/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Bảng điều khiển Giáo viên
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5" /> Trợ Lý AI Giảng Dạy
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            Trợ Lý AI Cho Giáo Viên Toán 8
          </h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {["Soạn đề bài", "Gợi ý giáo án", "Định dạng LaTeX", "Chấm bài tự động"].map((task) => (
            <button
              key={task}
              onClick={() => {
                setSelectedTask(task);
                handleSend(`Em hãy hỗ trợ Thầy/Cô nội dung liên quan tới: ${task}`);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedTask === task
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              ⚡ {task}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Sidebar Tools */}
        <div className="hidden lg:flex flex-col gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Tiện Ích Trợ Lý
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs">
            <Link
              href="/teacher/questions/ai"
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all block space-y-1 group"
            >
              <span className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4 text-cyan-400" /> Trình tạo câu hỏi AI
              </span>
              <p className="text-slate-400 leading-relaxed">
                Tạo ngân hàng câu hỏi hàng loạt theo ma trận GDPT 2018.
              </p>
            </Link>

            <Link
              href="/teacher/assignments/new"
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all block space-y-1 group"
            >
              <span className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-indigo-400" /> Giao bài kiểm tra nhanh
              </span>
              <p className="text-slate-400 leading-relaxed">
                Đóng gói bài giao và phát hành ngay tới lớp học sinh.
              </p>
            </Link>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Chuẩn GDPT 2018
              </span>
              <p className="text-slate-400 leading-relaxed">
                Nội dung AI được tối ưu theo khung chương trình Toán 8 bộ sách mới.
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Chat Window */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-none space-y-3"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-1.5 mb-1.5 text-[11px] font-semibold text-slate-400">
                    <span>{msg.sender === "user" ? "Giáo viên" : "Trợ Lý AI Giảng Dạy"}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <MathRenderer content={msg.text} />

                  {/* Suggested Teacher Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                        ⚡ Thao tác nhanh cho Giáo viên:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedActions.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(item.action)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-medium border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-left"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3.5 flex-row items-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  Trợ lý AI đang soạn câu hỏi & lời giải LaTeX...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Yêu cầu AI soạn câu hỏi, giáo án hoặc đáp án (VD: Soạn 2 câu hằng đẳng thức)..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
              >
                <span>Gửi yêu cầu</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
