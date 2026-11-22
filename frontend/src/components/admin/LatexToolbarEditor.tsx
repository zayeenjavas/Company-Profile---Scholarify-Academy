"use client";

import { useRef, useState } from "react";
import { Bold, Eye, EyeOff, Italic, Sigma } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichMathText } from "@/src/components/common/RichMathText";

interface LatexToolbarEditorProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  compact?: boolean;
  label?: string;
}

const MATH_TEMPLATES: Array<{ label: string; title: string; snippet: string; wrapMath?: boolean }> = [
  { label: "$x$", title: "Sisipkan Inline Math ($...$)", snippet: "$ $", wrapMath: false },
  { label: "$$x$$", title: "Sisipkan Blok Equation ($$...$$)", snippet: "$$\n\n$$", wrapMath: false },
  { label: "a/b", title: "Pecahan (\\frac{a}{b})", snippet: "\\frac{a}{b}", wrapMath: true },
  { label: "xⁿ", title: "Pangkat (x^{n})", snippet: "^{n}", wrapMath: true },
  { label: "xₙ", title: "Subskrip (x_{n})", snippet: "_{n}", wrapMath: true },
  { label: "√x", title: "Akar (\\sqrt{x})", snippet: "\\sqrt{x}", wrapMath: true },
  { label: "∫", title: "Integral", snippet: "\\int_{a}^{b} f(x)\\,dx", wrapMath: true },
  { label: "∑", title: "Sigma", snippet: "\\sum_{i=1}^{n} x_i", wrapMath: true },
  { label: "lim", title: "Limit", snippet: "\\lim_{x \\to \\infty}", wrapMath: true },
  { label: "[M]", title: "Matriks 2×2", snippet: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", wrapMath: true },
];

const QUICK_SYMBOLS: Array<{ label: string; tex: string }> = [
  { label: "≤", tex: "\\le " },
  { label: "≥", tex: "\\ge " },
  { label: "≠", tex: "\\ne " },
  { label: "≈", tex: "\\approx " },
  { label: "±", tex: "\\pm " },
  { label: "×", tex: "\\times " },
  { label: "÷", tex: "\\div " },
  { label: "∞", tex: "\\infty " },
  { label: "π", tex: "\\pi " },
  { label: "θ", tex: "\\theta " },
  { label: "α", tex: "\\alpha " },
  { label: "β", tex: "\\beta " },
  { label: "→", tex: "\\to " },
  { label: "⇒", tex: "\\Rightarrow " },
  { label: "∈", tex: "\\in " },
  { label: "∪", tex: "\\cup " },
  { label: "∩", tex: "\\cap " },
];

function isInsideDollarMath(text: string, pos: number): boolean {
  const before = text.slice(0, pos);
  const singleDollars = (before.match(/(?<!\\)\$/g) || []).length;
  return singleDollars % 2 === 1;
}

export function LatexToolbarEditor({
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  compact = false,
  label,
}: LatexToolbarEditorProps) {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const hasMath = /\$|\\[a-zA-Z]+|\*\*/.test(value);
  const previewVisible = showPreview || hasMath;

  const insertAtCursor = (snippet: string, wrapMathIfNeeded = false) => {
    const el = inputRef.current;
    if (!el) {
      onChange(value + (wrapMathIfNeeded ? `$${snippet}$` : snippet));
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);

    let toInsert = snippet;
    if (selected && (snippet === "**teks**" || snippet === "*teks*")) {
      const marker = snippet.startsWith("**") ? "**" : "*";
      toInsert = `${marker}${selected}${marker}`;
    } else if (selected && snippet === "$ $") {
      toInsert = `$${selected}$`;
    } else if (wrapMathIfNeeded && !isInsideDollarMath(value, start)) {
      toInsert = `$${snippet}$`;
    }

    const next = value.slice(0, start) + toInsert + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const cursorPos = start + toInsert.length;
      el.setSelectionRange(cursorPos, cursorPos);
    });
  };

  return (
    <div className="space-y-1.5">
      {label && <div className="text-sm font-medium leading-none">{label}</div>}

      {/* Word-style Equation & Formatting Header Ribbon */}
      <div className="rounded-lg border border-border bg-muted/40 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/70 px-2 py-1.5">
          <span className="mr-1 inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            <Sigma className="size-3" />
            {compact ? "LaTeX" : "Equation & Format"}
          </span>

          {!compact && (
            <>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                title="Tebal (**teks**)"
                onClick={() => insertAtCursor("**teks**")}
                className="h-6 px-1.5"
              >
                <Bold className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                title="Miring (*teks*)"
                onClick={() => insertAtCursor("*teks*")}
                className="h-6 px-1.5"
              >
                <Italic className="size-3.5" />
              </Button>
              <span className="mx-0.5 h-4 w-px bg-border" />
            </>
          )}

          {(compact ? MATH_TEMPLATES.slice(0, 6) : MATH_TEMPLATES).map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              title={tpl.title}
              onClick={() => insertAtCursor(tpl.snippet, tpl.wrapMath)}
              className="rounded border border-border/60 bg-background px-1.5 py-0.5 text-[11px] font-medium text-foreground transition hover:border-primary/50 hover:bg-primary/5"
            >
              {tpl.label}
            </button>
          ))}

          {!compact && (
            <>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <div className="flex flex-wrap items-center gap-0.5">
                {QUICK_SYMBOLS.map((sym) => (
                  <button
                    key={sym.label}
                    type="button"
                    title={`Sisipkan ${sym.tex.trim()}`}
                    onClick={() => insertAtCursor(sym.tex, true)}
                    className="rounded px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition hover:bg-background hover:text-foreground"
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-background hover:text-foreground"
            title="Toggle Preview KaTeX"
          >
            {previewVisible ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            Preview
          </button>
        </div>

        {/* Actual Input / Textarea */}
        {compact ? (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="border-0 rounded-none bg-background focus-visible:ring-0"
          />
        ) : (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="border-0 rounded-none bg-background focus-visible:ring-0 resize-y"
          />
        )}
      </div>

      {/* Live KaTeX Preview */}
      {previewVisible && value.trim().length > 0 && (
        <div className="rounded-md border border-dashed border-primary/30 bg-primary/[0.03] px-3 py-2 text-sm">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Preview Hasil LaTeX
          </p>
          <RichMathText text={value} />
        </div>
      )}
    </div>
  );
}
