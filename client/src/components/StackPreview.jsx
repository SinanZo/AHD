import React, { useMemo, useState } from 'react';

/**
 * StackPreview
 * - Renders first `initialLines` of the stack with a "Show more" toggle.
 * - "Copy" button copies the full stack (fallback included if Clipboard API is blocked).
 * - Attempts to linkify frames containing URLs so devs can jump quickly.
 */
export default function StackPreview({
  stack,
  initialLines = 6,
  className = '',
  'data-testid': testId,
}) {
  const [expanded, setExpanded] = useState(false);

  // Normalize to string once, guard against objects / non-strings
  const full = useMemo(() => (stack == null ? '' : String(stack)), [stack]);

  // Pre-split for fast show/hide
  const lines = useMemo(() => full.split('\n'), [full]);
  const shown = expanded ? lines : lines.slice(0, initialLines);

  if (!full) return null;

  // Linkify any "http(s)://..." bit inside a line. Keep it tiny and safe.
  const urlRe = /\bhttps?:\/\/[^\s)]+/g;

  function renderLine(line, idx) {
    const parts = [];
    let lastIndex = 0;
    let m;
    while ((m = urlRe.exec(line))) {
      const [url] = m;
      const start = m.index;
      if (start > lastIndex) parts.push(line.slice(lastIndex, start));
      parts.push(
        <a
          key={`${idx}-${start}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted hover:decoration-solid"
        >
          {url}
        </a>
      );
      lastIndex = start + url.length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    return parts.length ? parts : line;
  }

  async function copyAll() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(full);
      } else {
        // Fallback for restricted environments
        const ta = document.createElement('textarea');
        ta.value = full;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch {
      // If copy fails, we silently ignore—this UI is best-effort
    }
  }

  return (
    <section
      // include "preview" in the accessible name to match test expectations
      aria-label="Error stack trace preview"
      className={className}
      data-testid={testId || 'stack-preview'}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[var(--muted,#6b7280)]">
          {expanded ? 'Full stack' : `First ${Math.min(initialLines, lines.length)} lines`}
        </span>
        <div className="ms-auto flex gap-2">
          {lines.length > initialLines && (
            <button
              type="button"
              className="rounded px-2 py-1 text-xs border border-[var(--stroke,#e5e7eb)] hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
          <button
            type="button"
            className="rounded px-2 py-1 text-xs border border-[var(--stroke,#e5e7eb)] hover:bg-black/5 dark:hover:bg-white/10"
            onClick={copyAll}
            aria-label="Copy full stack to clipboard"
            title="Copy"
          >
            Copy
          </button>
        </div>
      </div>

      <pre
        className="mt-1 max-h-40 overflow-auto text-xs bg-black/5 dark:bg-white/5 rounded p-3 leading-5"
        dir="ltr"
        role="region"
        aria-live="off"
      >
        <code className="font-mono whitespace-pre text-[0.78rem]">
          {shown.map((ln, i) => (
            <div key={i} className="min-h-[1em]">
              {renderLine(ln, i)}
            </div>
          ))}
        </code>
      </pre>
    </section>
  );
}