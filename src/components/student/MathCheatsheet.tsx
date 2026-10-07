"use client";

import React, { useState } from "react";
import { MathRenderer } from "@/components/math/MathRenderer";
import { BookMarked, Search, Copy, Check, Sparkles, HelpCircle } from "lucide-react";

interface FormulaCategory {
  category: string;
  items: {
    title: string;
    latex: string;
    note: string;
    example?: string;
  }[];
}

const FORMULA_DATABASE: FormulaCategory[] = [
  {
    category: "7 Hằng Đẳng Thức Đáng Nhớ (Lớp 8)",
    items: [
      {
        title: "Bình phương của một tổng",
        latex: "$$(a + b)^2 = a^2 + 2ab + b^2$$",
        note: "Chú ý số hạng giữa là $2ab$ (tích 2 lần số thứ nhất và thứ hai).",
        example: "$(x + 3)^2 = x^2 + 6x + 9$",
      },
      {
        title: "Bình phương của một hiệu",
        latex: "$$(a - b)^2 = a^2 - 2ab + b^2$$",
        note: "Chỉ mang dấu trừ ở số hạng $2ab$, số hạng $b^2$ luôn mang dấu dương.",
        example: "$(2x - 1)^2 = 4x^2 - 4x + 1$",
      },
      {
        title: "Hiệu hai bình phương",
        latex: "$$a^2 - b^2 = (a - b)(a + b)$$",
        note: "Phân tích thành tích của hiệu và tổng.",
        example: "$x^2 - 9 = (x - 3)(x + 3)$",
      },
      {
        title: "Lập phương của một tổng",
        latex: "$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$",
        note: "Hệ số Pascal lần lượt là $1 - 3 - 3 - 1$.",
        example: "$(x + 1)^3 = x^3 + 3x^2 + 3x + 1$",
      },
      {
        title: "Lập phương của một hiệu",
        latex: "$$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$",
        note: "Dấu đan xen: cộng, trừ, cộng, trừ.",
        example: "$(x - 2)^3 = x^3 - 6x^2 + 12x - 8$",
      },
      {
        title: "Tổng hai lập phương",
        latex: "$$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$$",
        note: "$a^2 - ab + b^2$ được gọi là bình phương thiếu của một hiệu.",
        example: "$x^3 + 8 = (x + 2)(x^2 - 2x + 4)$",
      },
      {
        title: "Hiệu hai lập phương",
        latex: "$$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$",
        note: "$a^2 + ab + b^2$ được gọi là bình phương thiếu của một tổng.",
        example: "$x^3 - 27 = (x - 3)(x^2 + 3x + 9)$",
      },
    ],
  },
  {
    category: "Phân Thức Đại Số & Hàm Số Bậc Nhất",
    items: [
      {
        title: "Tính chất cơ bản của phân thức",
        latex: "$$\\frac{A}{B} = \\frac{A \\cdot M}{B \\cdot M} \\quad (M \\neq 0)$$",
        note: "Có thể nhân hoặc chia cả tử và mẫu với cùng một đa thức khác 0.",
      },
      {
        title: "Phép cộng phân thức cùng mẫu",
        latex: "$$\\frac{A}{M} + \\frac{B}{M} = \\frac{A + B}{M}$$",
        note: "Cộng các tử thức với nhau và giữ nguyên mẫu thức.",
      },
      {
        title: "Hàm số bậc nhất",
        latex: "$$y = ax + b \\quad (a \\neq 0)$$",
        note: "Đồ thị là một đường thẳng. $a$ là hệ số góc, $b$ là tung độ gốc.",
        example: "Nếu $a > 0$ hàm đồng biến, nếu $a < 0$ hàm nghịch biến.",
      },
    ],
  },
  {
    category: "Hình Học & Tứ Giác Lớp 8",
    items: [
      {
        title: "Định lý Thalès trong tam giác",
        latex: "$$\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC} \\quad (DE \\parallel BC)$$",
        note: "Đường thẳng song song với một cạnh định ra trên hai cạnh còn lại các đoạn thẳng tương ứng tỉ lệ.",
      },
      {
        title: "Đường trung bình của tam giác",
        latex: "$$MN \\parallel BC \\quad \\text{và} \\quad MN = \\frac{1}{2}BC$$",
        note: "Đoạn thẳng nối trung điểm hai cạnh của tam giác song song và bằng nửa cạnh thứ ba.",
      },
      {
        title: "Diện tích xung quanh hình chóp đều",
        latex: "$$S_{xq} = p \\cdot d$$",
        note: "$p$ là nửa chu vi đáy, $d$ là trung đoạn của hình chóp đều.",
      },
    ],
  },
];

export const MathCheatsheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (latexText: string, key: string) => {
    navigator.clipboard.writeText(latexText.replace(/\$\$/g, ""));
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredCategories = FORMULA_DATABASE.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.example && item.example.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Sổ Tay Công Thức Toán 8</h2>
            <p className="text-xs font-medium text-slate-300">Tra cứu nhanh hằng đẳng thức, phân thức & hình học</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm công thức..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Formula Lists */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm font-medium bg-slate-900/60 rounded-2xl border border-slate-800">
          Không tìm thấy công thức nào khớp với từ khóa "{searchTerm}".
        </div>
      ) : (
        filteredCategories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> {cat.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                return (
                  <div
                    key={key}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 relative group shadow-xl"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <h4 className="font-extrabold text-white text-base">{item.title}</h4>
                      <button
                        onClick={() => handleCopy(item.latex, key)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
                        title="Sao chép công thức LaTeX"
                      >
                        {copiedIndex === key ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="py-3 px-4 rounded-xl bg-slate-950 text-center border border-slate-800/80">
                      <MathRenderer content={item.latex} block />
                    </div>

                    <p className="text-xs font-medium text-slate-300 leading-relaxed flex items-start gap-1.5 pt-1">
                      <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <MathRenderer content={item.note} />
                    </p>

                    {item.example && (
                      <div className="text-xs font-medium text-cyan-300 pt-2 border-t border-slate-800/80">
                        <span className="font-bold text-slate-400">Ví dụ:</span>{" "}
                        <MathRenderer content={item.example} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
