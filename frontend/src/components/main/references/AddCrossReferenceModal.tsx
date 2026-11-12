import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {useModal} from "@/contexts/ModalContext.tsx";
import {SearchNextPassage} from "@/components/ui/SearchNextPassage.tsx";

/* ---------- Types ---------- */

export type ConnectionType =
    | "Thematic Echo (Creation & Will)"
    | "Direct Quote / Citation"
    | "Allusion / Verbal Parallel"
    | "Prophetic Fulfillment"
    | "Theological Contrast"
    | "Historical Context";

export type Strength = "Moderate" | "Strong" | "Universal";

export interface SourceVerse {
    /** e.g. "Genesis 1:1" */
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    text: string;
}

export interface TargetPassage {
    /** e.g. "Revelation 4:11 (KJV)" */
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    text: string;
    /** Small caption on the right of the preview, e.g. "Doxology of Creation" */
    caption?: string;
}

export interface NewCrossReference {
    target: string;
    connectionType: ConnectionType;
    strength: Strength;
    tags: string[];
    note: string;
}

export interface AddCrossReferenceModalProps {
    isOpen: boolean;
    source: SourceVerse;
    /**
     * Resolve typed input (e.g. "Revelation 4:11") to a passage preview.
     * Return null if it can't be found. Without this, no preview/verified badge is shown.
     */
    lookupPassage?: (reference: string) => Promise<TargetPassage | null>;
    availableTags?: string[];
}

/* ---------- Constants ---------- */

const CONNECTION_TYPES: ConnectionType[] = [
    "Thematic Echo (Creation & Will)",
    "Direct Quote / Citation",
    "Allusion / Verbal Parallel",
    "Prophetic Fulfillment",
    "Theological Contrast",
    "Historical Context",
];

const STRENGTHS: Strength[] = ["Moderate", "Strong", "Universal"];

const DEFAULT_TAGS = ["Creation / Origin", "Sovereignty", "Parallel Phrasing", "Christological"];

/* ---------- Helpers ---------- */

/**
 * Parses "Revelation 4:11", "1 John 3:16-18" into parts that match the
 * cross_references table columns. Returns null if it doesn't look like a reference.
 */
export function parseReference(input: string) {
    const match = input.trim().match(/^(\d?\s?[A-Za-z][A-Za-z\s]*?)\s+(\d+):(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return null;
    const [, book, chapter, start, end] = match;
    return {
        book: book.trim(),
        chapter: Number(chapter),
        verseStart: Number(start),
        verseEnd: end ? Number(end) : Number(start),
    };
}


export default function AddCrossReferenceModal({
                                                   isOpen,
                                                   source,
                                                   lookupPassage,
                                                   availableTags = DEFAULT_TAGS,
                                               }: AddCrossReferenceModalProps) {
    const titleId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const [target, setTarget] = useState("");
    const [preview, setPreview] = useState<TargetPassage | null>(null);
    const [connectionType, setConnectionType] = useState<ConnectionType>(CONNECTION_TYPES[0]);
    const [strength, setStrength] = useState<Strength>("Strong");
    const [tags, setTags] = useState<string[]>([]);
    const [tagOptions, setTagOptions] = useState<string[]>(availableTags);
    const [addingTag, setAddingTag] = useState(false);
    const [customTag, setCustomTag] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const {setCrossReferenceModalOpen} = useModal()

    const canSubmit = target.trim().length > 0 && !submitting;

    function onClose() {
        setCrossReferenceModalOpen(false);

    }

    function onSubmit(ref: NewCrossReference) {
        const [bookName, chapterVerse] = ref.target.split(" ")
        const [ch, ver] = chapterVerse.split(":");

    }

    // Reset form each time the modal opens
    useEffect(() => {
        if (!isOpen) return;
        setTarget("");
        setPreview(null);
        setConnectionType(CONNECTION_TYPES[0]);
        setStrength("Strong");
        setTags([]);
        setTagOptions(availableTags);
        setAddingTag(false);
        setCustomTag("");
        setNote("");
        setSubmitting(false);
        inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !lookupPassage) return;
        const query = target.trim();
        if (!query) {
            setPreview(null);
            return;
        }
        let cancelled = false;
        const t = setTimeout(async () => {
            try {
                const result = await lookupPassage(query);
                if (!cancelled) setPreview(result);
            } catch {
                if (!cancelled) setPreview(null);
            }
        }, 300);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [target, isOpen, lookupPassage]);

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);

        try {
            await onSubmit({
                target: target.trim(),
                connectionType,
                strength,
                tags,
                note: note.trim(),
            });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    // Esc to dismiss, Cmd/Ctrl+Enter to submit
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, target, connectionType, strength, tags, note, submitting]);

    const toggleTag = (tag: string) =>
        setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

    const commitCustomTag = () => {
        const tag = customTag.trim();
        if (tag) {
            if (!tagOptions.includes(tag)) setTagOptions((prev) => [...prev, tag]);
            setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
        }
        setCustomTag("");
        setAddingTag(false);
    };

    const onCustomTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            commitCustomTag();
        }
        if (e.key === "Escape") {
            e.stopPropagation();
            setCustomTag("");
            setAddingTag(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-5 sm:px-6 border-b border-stone-200/80 flex items-start justify-between bg-stone-50/60">
                    <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <h3 id={titleId} className="text-lg font-geist-mono font-bold text-stone-950">
                                Add Cross Reference
                            </h3>
                        </div>
                        <p className="text-xs text-stone-500 font-geist">
                            Link a validated scriptural connection to{" "}
                            <span className="font-semibold text-stone-800 font-geist-propo">{`${source.bookName} ${source.chapterNumber}:${source.verseNumber}`}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close dialog"
                        onClick={onClose}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white

            [&::-webkit-scrollbar]:h-[6px]
            [&::-webkit-scrollbar]:w-[2px]
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-400
                "
                >
                    {/* Source verse */}
                    <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-3.5 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-bold text-xs flex-none mt-0.5">
                            {source.bookName.slice(0, 3)}
                        </div>
                        <div className="text-xs">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold font-geist text-stone-900 text-sm">{`${source.bookName} ${source.chapterNumber}:${source.verseNumber}`}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-amber-200/60 text-amber-800 rounded font-sans">
                  Source Verse
                </span>
                            </div>
                            <p className="font-geist italic text-stone-700 leading-relaxed">“{source.text}”</p>
                        </div>
                    </div>

                    {/* Target passage */}
                    <div className="space-y-2">
                        <label htmlFor={`${titleId}-target`} className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                            Target Scripture Passage
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <SearchNextPassage inputRef={inputRef} setTarget={setTarget} titleId={titleId} target={target}/>
                            {preview && (
                                <span className="absolute right-2.5 top-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
                            )}
                        </div>

                        {preview && (
                            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-serif font-bold text-blue-700">{preview.caption}</span>
                                    {preview.caption && (
                                        <span className="text-stone-400 text-[11px] font-mono">{preview.caption}</span>
                                    )}
                                </div>
                                <p className="font-serif text-xs text-stone-700 leading-relaxed">
                                    {preview.verseNumber && (
                                        <sup className="font-sans text-rose-600 font-bold mr-1">{preview.verseNumber}</sup>
                                    )}
                                    “{preview.text}”
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Connection type + strength */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor={`${titleId}-type`} className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                                Connection Type
                            </label>
                            <select
                                id={`${titleId}-type`}
                                value={connectionType}
                                onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
                                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                            >
                                {CONNECTION_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
              <span className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Confidence / Strength
              </span>
                            <div role="radiogroup" aria-label="Confidence" className="flex items-center gap-1.5 pt-1.5">
                                {STRENGTHS.map((s) => {
                                    const active = s === strength;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            role="radio"
                                            aria-checked={active}
                                            onClick={() => setStrength(s)}
                                            className={
                                                active
                                                    ? "flex-1 text-center py-1 text-xs rounded border border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-xs"
                                                    : "flex-1 text-center py-1 text-xs rounded border border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
                                            }
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
            <span className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
              Theme Category Tags
            </span>
                        <div className="flex flex-wrap gap-1.5">
                            {tagOptions.map((tag) => {
                                const active = tags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => toggleTag(tag)}
                                        className={
                                            active
                                                ? "px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"
                                                : "px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 hover:bg-stone-200/70 border border-stone-200"
                                        }
                                    >
                                        {tag}
                                        {active ? " ✓" : ""}
                                    </button>
                                );
                            })}

                            {addingTag ? (
                                <input
                                    autoFocus
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    onKeyDown={onCustomTagKey}
                                    onBlur={commitCustomTag}
                                    placeholder="Tag name"
                                    className="px-2.5 py-1 rounded-full text-xs border border-amber-500 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 w-28"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setAddingTag(true)}
                                    className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-400"
                                >
                                    + Custom tag
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                        <label htmlFor={`${titleId}-note`} className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                            Explanatory Note <span className="font-normal text-stone-400 lowercase">(optional)</span>
                        </label>
                        <textarea
                            id={`${titleId}-note`}
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Explain the connection or theological significance..."
                            className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 leading-relaxed"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                        <kbd className="font-mono text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded shadow-2xs">Esc</kbd>
                        <span>to dismiss</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Submit Reference</span>
                            <kbd className="font-mono text-[10px] text-stone-400 bg-stone-800 px-1 py-0.5 rounded border border-stone-700 ml-1">
                                ⌘↩
                            </kbd>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}