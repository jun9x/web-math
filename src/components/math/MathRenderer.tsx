"use client";

import React from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = "",
  block = false,
}) => {
  if (!content) return null;

  const renderKaTeX = (latex: string, displayMode: boolean) => {
    try {
      const cleanLatex = latex.trim();
      const html = katex.renderToString(cleanLatex, {
        displayMode,
        throwOnError: false,
      });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <span>{latex}</span>;
    }
  };

  // If content has $ or $$ wrappers
  if (content.includes("$")) {
    const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    return (
      <span className={`inline-math-container ${className}`}>
        {parts.map((part, index) => {
          if (!part) return null;
          if (part.startsWith("$$") && part.endsWith("$$")) {
            const math = part.slice(2, -2);
            return (
              <span key={index} className="block my-2 overflow-x-auto text-center">
                {renderKaTeX(math, true)}
              </span>
            );
          } else if (part.startsWith("$") && part.endsWith("$")) {
            const math = part.slice(1, -1);
            return <span key={index} className="inline-block px-1">{renderKaTeX(math, false)}</span>;
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  }

  // Direct math string rendering
  const isDirectMath = /[\\^_{}=<>]/.test(content);
  return (
    <span className={`${block ? "block my-2 text-center" : "inline-block"} ${className}`}>
      {isDirectMath ? renderKaTeX(content, block) : content}
    </span>
  );
};
