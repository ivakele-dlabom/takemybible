
import React, { useMemo, useState } from "react";
import {
    getBibleSuggestions,
    parseBibleReference
} from "@/lib/utils.ts";

interface Props {
    inputRef: React.RefObject<HTMLInputElement | null>;
    setTarget: (value: React.SetStateAction<string>) => void;
    titleId: string;
    target: string;
}

export const SearchNextPassage = ({
                                      inputRef,
                                      setTarget,
                                      titleId,
                                      target
                                  }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const suggestions = useMemo(
        () => getBibleSuggestions(target),
        [target]
    );

    const parsedReference = useMemo(
        () => parseBibleReference(target),
        [target]
    );

    const isValid = parsedReference.valid;

    const selectSuggestion = (value: string) => {
        setTarget(value);
        setActiveIndex(0);
        inputRef.current?.focus();
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            return;
        }

        if (!isOpen || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();

            setActiveIndex(index =>
                (index + 1) % suggestions.length
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();

            setActiveIndex(index =>
                (index - 1 + suggestions.length) %
                suggestions.length
            );
        }

        if (e.key === "Enter" && suggestions[activeIndex]) {
            e.preventDefault();
            selectSuggestion(suggestions[activeIndex].value);
        }
    };

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                id={`${titleId}-target`}
                type="text"
                value={target}
                autoComplete="off"
                onChange={e => {
                    setTarget(e.target.value);
                    setActiveIndex(0);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Revelation 4:11"
                aria-autocomplete="list"
                aria-expanded={isOpen && suggestions.length > 0}
                aria-controls={`${titleId}-suggestions`}
                aria-invalid={target.includes(":") && !isValid}
                className={`w-full pl-9 pr-24 py-2 text-sm bg-stone-50 border rounded-lg text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    target.includes(":") && !isValid
                        ? "border-red-400 focus:ring-red-500/30"
                        : "border-stone-200 focus:ring-amber-500/30 focus:border-amber-500"
                }`}
            />

            {isOpen && suggestions.length > 0 && (
                <ul
                    id={`${titleId}-suggestions`}
                    role="listbox"
                    className="absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-y-auto rounded-lg border border-stone-200 bg-white shadow-lg py-1"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.value}
                            role="presentation"
                        >
                            <button
                                type="button"
                                role="option"
                                aria-selected={activeIndex === index}
                                onMouseDown={e => e.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() =>
                                    selectSuggestion(suggestion.value)
                                }
                                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                                    activeIndex === index
                                        ? "bg-amber-50 text-amber-900"
                                        : "text-stone-700 hover:bg-stone-50"
                                }`}
                            >
                                <span>{suggestion.label}</span>

                                <span className="float-right text-xs text-stone-400">
                                    {suggestion.type === "BOOK" && "Book"}
                                    {suggestion.type === "CHAPTER" && "Chapter"}
                                    {suggestion.type === "VERSE" && "Verse"}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {target.includes(":") && isValid && (
                <span className="sr-only">
                    Valid Bible reference
                </span>
            )}
        </div>
    );
};
