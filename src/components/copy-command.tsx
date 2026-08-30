"use client";

import { useState } from "react";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(command).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          },
          () => setCopied(false),
        );
      }}
      className="group flex w-full items-center gap-4 rounded-xl border border-rule bg-ink-2/80 px-5 py-4 text-left transition-colors duration-200 hover:border-acid-deep sm:w-auto"
      aria-label={`Copy: ${command}`}
    >
      <span aria-hidden className="text-acid-deep select-none">
        $
      </span>
      <code className="flex-1 text-[15px] text-paper">{command}</code>
      <span
        className={`text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-200 ${
          copied ? "text-acid" : "text-paper-faint group-hover:text-paper-dim"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
