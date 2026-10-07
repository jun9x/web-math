"use client";

import React, { useRef, useState, useEffect } from "react";
import { Eraser, RotateCcw, PenTool, Circle, Square, Trash2 } from "lucide-react";

export const Scratchpad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#818cf8"); // Indigo default
  const [lineWidth, setLineWidth] = useState(3);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 450;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = mode === "eraser" ? "#0f172a" : color;
    ctx.lineWidth = mode === "eraser" ? lineWidth * 4 : lineWidth;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("pen")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "pen"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Bút vẽ
          </button>
          <button
            onClick={() => setMode("eraser")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === "eraser"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" /> Tẩy xóa
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Color Selectors */}
          <div className="flex items-center gap-1.5">
            {["#818cf8", "#38bdf8", "#34d399", "#f43f5e", "#fbbf24", "#ffffff"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setMode("pen");
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c && mode === "pen" ? "scale-110 border-white" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stroke Width */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mr-2">
            <span>Nét:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20 accent-indigo-500 cursor-pointer"
            />
          </div>

          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Xóa bảng nháp
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 cursor-crosshair relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full touch-none"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 pointer-events-none select-none">
          Bảng Nháp Toán Học MathLab - Vẽ hình học & Thử nghiệm phép tính
        </div>
      </div>
    </div>
  );
};
