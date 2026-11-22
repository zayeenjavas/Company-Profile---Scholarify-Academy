"use client";

import React from "react";
import katex from "katex";

interface RichMathTextProps {
  text: string | null | undefined;
  className?: string;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "inline-math"; content: string }
  | { type: "display-math"; content: string };

function splitMathSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  // Matches $$...$$, \[...\], $...$, or \(...\)
  const regex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$(?:\\.|[^$\n])+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith("$$") && token.endsWith("$$")) {
      segments.push({ type: "display-math", content: token.slice(2, -2).trim() });
    } else if (token.startsWith("\\[") && token.endsWith("\\]")) {
      segments.push({ type: "display-math", content: token.slice(2, -2).trim() });
    } else if (token.startsWith("\\(") && token.endsWith("\\)")) {
      segments.push({ type: "inline-math", content: token.slice(2, -2).trim() });
    } else if (token.startsWith("$") && token.endsWith("$")) {
      segments.push({ type: "inline-math", content: token.slice(1, -1).trim() });
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", content: input.slice(lastIndex) });
  }
  return segments;
}

function renderInlineFormatting(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={`${keyPrefix}-i-${idx}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
  });
}

export function RichMathText({ text, className = "" }: RichMathTextProps) {
  if (!text) return null;
  const segments = splitMathSegments(text);

  return (
    <span className={`whitespace-pre-wrap break-words ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return (
            <React.Fragment key={idx}>
              {renderInlineFormatting(seg.content, `seg-${idx}`)}
            </React.Fragment>
          );
        }

        const isDisplay = seg.type === "display-math";
        let html = "";
        try {
          html = katex.renderToString(seg.content, {
            displayMode: isDisplay,
            throwOnError: false,
            strict: false,
          });
        } catch {
          return (
            <code key={idx} className="rounded bg-muted px-1 py-0.5 text-xs">
              {seg.content}
            </code>
          );
        }

        if (isDisplay) {
          return (
            <span
              key={idx}
              className="my-2 block overflow-x-auto py-1 text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        return (
          <span
            key={idx}
            className="inline-block align-middle"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
