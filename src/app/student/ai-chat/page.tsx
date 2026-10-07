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
  Compass,
  Zap,
  CheckCircle2
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export default function StudentAiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Xin chào bạn! Thầy là **Gia Sư Toán AI Socratic** dành riêng cho chương trình **Toán Lớp 8 (GDPT 2018)**. 🎓\n\nThầy có thể hướng dẫn bạn hiểu sâu các chủ đề như:\n- ✨ *7 Hằng đẳng thức đáng nhớ*\n- 📐 *Tứ giác & Hình học 8*\n- 📊 *Phương trình bậc nhất 1 ẩn & Hàm số*\n\nBạn đang gặp khó khăn hay cần thầy hướng dẫn bài toán nào?",
      timestamp: "Vừa xong",
      suggestedQuestions: [
        "Thầy giải thích cho em hằng đẳng thức (a+b)³ với ạ!",
        "Làm sao để nhận biết hình bình hành là hình chữ nhật?",
        "Cách giải phương trình 2x - 8 = 0 như thế nào?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Hằng đẳng thức");
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
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: query,
          grade: 8,
        }),
      });

      if (!res.ok) {
        // Fallback simulated response for local demo mode without full backend session
        setTimeout(() => {
          generateFallbackAiResponse(query);
          setLoading(false);
        }, 800);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      const aiMsgId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiText += decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiText } : msg))
          );
        }
      }
      setLoading(false);
    } catch (err) {
      // Fallback response on error
      generateFallbackAiResponse(query);
      setLoading(false);
    }
  };

  const generateFallbackAiResponse = (userQuery: string) => {
    let reply = "";
    let suggestions: string[] = [];

    const lower = userQuery.toLowerCase();
    if (lower.includes("hằng đẳng thức") || lower.includes("(a+b)") || lower.includes("bình phương")) {
      reply = `Để khai triển hoặc áp dụng hằng đẳng thức, chúng ta hãy cùng nhớ lại công thức gốc nhé:\n\n$$\\mathbf{(a + b)^2 = a^2 + 2ab + b^2}$$\n$$\\mathbf{(a - b)^2 = a^2 - 2ab + b^2}$$\n\n👉 **Gợi ý tư duy từ Thầy:** Hãy xác định rõ xem trong bài toán của em, đâu là $a$ và đâu là $b$. Em hãy thử thay giá trị $a$ và $b$ vào xem ra kết quả bao nhiêu?`;
      suggestions = [
        "Ví dụ khai triển (x + 3)² như thế nào ạ?",
        "Khi nào dùng (a - b)(a + b) ạ?",
      ];
    } else if (lower.includes("phương trình") || lower.includes("2x")) {
      reply = `Để giải phương trình bậc nhất $ax + b = 0$ ($a \\neq 0$), em thực hiện qua 2 bước đơn giản:\n\n1. **Bước 1:** Chuyển số hạng tự do $b$ sang vế phải (nhớ đổi dấu thành $-b$).\n2. **Bước 2:** Chia cả 2 vế cho hệ số $a$ để tìm $x = -\\frac{b}{a}$.\n\nVí dụ với $2x - 8 = 0$, em thử chuyển $-8$ sang vế phải xem ta được $2x$ bằng bao nhiêu?`;
      suggestions = [
        "2x = 8 đúng không thầy?",
        "Nếu phương trình có ngoặc thì làm sao ạ?",
      ];
    } else if (lower.includes("hình") || lower.includes("tứ giác") || lower.includes("chữ nhật")) {
      reply = `Trong chương trình **Hình học 8**, một **Hình bình hành** sẽ trở thành **Hình chữ nhật** nếu thỏa mãn 1 trong các dấu hiệu sau:\n\n1. Có **1 góc vuông** ($90^\\circ$).\n2. Có **2 đường chéo bằng nhau** ($AC = BD$).\n\nEm đang làm bài tập chứng minh tứ giác nào vậy? Hãy gửi đề bài cho thầy nhé!`;
      suggestions = [
        "Cách chứng minh hình hình hành?",
        "Tính chất hai đường chéo hình chữ nhật?",
      ];
    } else {
      reply = `Cảm ơn câu hỏi rất hay của em! 🌟\n\nVới chủ đề **Toán Lớp 8 (GDPT 2018)**, em hãy chú ý phân tích kỹ yêu cầu của đề bài:\n- Xác định giả thiết & kết luận.\n- Đưa về dạng toán quen thuộc (Rút gọn, Tìm $x$, Chứng minh hình học).\n\nEm có muốn thầy đưa ra một gợi ý nhỏ để giải bài này không?`;
      suggestions = [
        "Cho em 1 ví dụ rèn luyện chủ đề này với ạ!",
        "Tóm tắt lý thuyết trọng tâm",
      ];
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedQuestions: suggestions,
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
              href="/student/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              ← Bảng điều khiển
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Gia Sư Trực Tuyến Socratic
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            Học Cùng Gia Sư AI Toán 8
          </h1>
        </div>

        {/* Quick Topic Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {["Hằng đẳng thức", "Tứ giác", "Phương trình", "Hàm số y=ax+b"].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic);
                handleSend(`Thầy ơi, hướng dẫn em kiến thức phần ${topic} với ạ!`);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedTopic === topic
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              # {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Helper Topics & Prompt Starters */}
        <div className="hidden lg:flex flex-col gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-cyan-400" /> Trợ Lý Học Tập AI
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 flex-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Phương pháp Socratic
              </span>
              <p className="text-slate-300 leading-relaxed">
                AI sẽ gợi ý từng bước tư duy thay vì cho đáp án ngay, giúp em ghi nhớ lâu hơn!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" /> Hỗ trợ Công thức LaTeX
              </span>
              <p className="text-slate-300 leading-relaxed">
                Em có thể nhập biểu thức dạng <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">$x^2 + 2x + 1$</code> để AI hiển thị toán đẹp mắt.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Giới hạn an toàn
              </span>
              <p className="text-slate-300 leading-relaxed">
                Mỗi ngày em có 30 lượt tương tác hỏi đáp miễn phí cùng Gia sư AI.
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Chat Window */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
          {/* Message Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-none space-y-3"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-1.5 mb-1.5 text-[11px] font-semibold text-slate-400">
                    <span>{msg.sender === "user" ? "Học sinh" : "Gia sư AI Socratic"}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <MathRenderer content={msg.text} />

                  {/* Quick Click Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" /> Gợi ý câu hỏi nối tiếp:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-medium border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-left"
                          >
                            💡 {q}
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  Gia sư AI đang suy luận bước giải...
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
                placeholder="Nhập bài toán hoặc câu hỏi (VD: Gợi ý cho em bài 2x - 8 = 0)..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
              >
                <span>Gửi</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
