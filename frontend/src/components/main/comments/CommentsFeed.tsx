import CommentCard from "./CommentCard.tsx";
import WriteCommentField from "./WriteCommentField.tsx";


interface Reply {
    id: string;
    author: string;
    avatar: { kind: "initials"; initials: string; colorClass: string };
    body: string;
}

interface Comment {
    id: string;
    author: string;
    avatar:
        | { kind: "initials"; initials: string; colorClass: string }
        | { kind: "icon"; colorClass: string };
    body: string;
    replies?: Reply[];
}

const comments: Comment[] = [
    {
        id: "1",
        author: "Dr. Elara Vance",
        avatar: { kind: "initials", initials: "EV", colorClass: "bg-amber-200 text-amber-900" },
        body: "The linguistic structure here suggests a completed totality. The term 'host' (tsaba) implies an organized, multi-layered cosmic order, not merely a collection of objects. This transition from chaos to 'finished' order is the crucial ontological shift.",
        replies: [
            {
                id: "1-1",
                author: "Julian Marx",
                avatar: { kind: "initials", initials: "JM", colorClass: "bg-neutral-300 text-neutral-800" },
                body: "Does 'finished' here imply a cessation of creative energy, or simply the completion of the foundational blueprint?",
            },
        ],
    },
    {
        id: "2",
        author: "Prof. Arthur Hawthorne",
        avatar: { kind: "initials", initials: "AH", colorClass: "bg-emerald-200 text-emerald-900" },
        body: "Note the chiastic symmetry in the broader context. This verse serves as the resolution to the opening 'In the beginning'. The 'heavens and earth' wrap around the entire creative narrative like a literary parenthesis.",
    },
    {
        id: "3",
        author: "Sophia Chen",
        avatar: { kind: "icon", colorClass: "bg-indigo-100 text-indigo-400" },
        body: "Looking at the Septuagint translation of 'finished' (synetelesthēsan), it carries a sense of reaching a perfected end-goal.",
    },
];



interface Props {
    selectedVerse?: boolean;
    className?: string;

}

export default function CommentsFeed({ selectedVerse, className }: Props) {
    return (
        <div className={" flex w-full max-w-100 flex-col gap-4 p-6 h-165"}>
            <CommentCard className={""} />
            <WriteCommentField className="mt-auto w-full max-h-60" />
        </div>
    );
}
