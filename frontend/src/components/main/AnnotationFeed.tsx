import React from "react";
import { Link } from "lucide-react";

type EntryType = "reflection" | "cross-reference" | "structural";

interface CrossReferenceData {
  title: string;
  quote: string;
}

interface AnnotationEntry {
  id: string;
  type: EntryType;
  label: string;
  timestamp: string;
  body?: string;
  reference?: CrossReferenceData;
}

const TYPE_LABELS: Record<EntryType, string> = {
  reflection: "Private Reflection",
  "cross-reference": "Cross-Reference",
  structural: "Structural Observation",
};

const entries: AnnotationEntry[] = [
  {
    id: "1",
    type: "reflection",
    label: TYPE_LABELS.reflection,
    timestamp: "2m ago",
    body: 'The concept of "finished" (Hebrew: *waykullu*) implies more than just cessation; it suggests completion to an intended perfection. Contrast this with the later entropic descriptions in thermodynamics.',
  },
  {
    id: "2",
    type: "cross-reference",
    label: TYPE_LABELS["cross-reference"],
    timestamp: "1h ago",
    reference: {
      title: "Plato's Timaeus, 30a",
      quote:
        '"For God desired that, so far as possible, all things should be good and nothing evil…"',
    },
  },
  {
    id: "3",
    type: "structural",
    label: TYPE_LABELS.structural,
    timestamp: "4h ago",
    body:
      'The transition from cosmic narrative to individual stewardship begins here. The "host" (ṣəḇā\u02BEâm) establishes a hierarchy that is both physical and metaphysical.',
  },
];

/** Renders *italic* segments within a plain-text body string. */
function renderBody(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function EntryCard({ entry }: { entry: AnnotationEntry }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-5">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
        <span>{entry.label}</span>
        <span aria-hidden="true">&bull;</span>
        <span>{entry.timestamp}</span>
      </div>

      {entry.type === "cross-reference" && entry.reference ? (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Link size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">
              {entry.reference.title}
            </p>
            <p className="mt-0.5 italic text-neutral-500">
              {entry.reference.quote}
            </p>
          </div>
        </div>
      ) : (
        <p className="leading-relaxed text-neutral-900">
          {entry.body ? renderBody(entry.body) : null}
        </p>
      )}
    </div>
  );
}

export default function AnnotationFeed() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
