import { User } from "lucide-react";
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

function Avatar({
                    avatar,
                    size = "md",
                }: {
    avatar: Comment["avatar"] | Reply["avatar"];
    size?: "sm" | "md";
}) {
    const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

    if (avatar.kind === "icon") {
        return (
            <div
                className={`flex ${sizeClass} flex-none items-center justify-center rounded-full ${avatar.colorClass}`}
            >
                <User size={size === "sm" ? 16 : 18} strokeWidth={2} />
            </div>
        );
    }

    return (
        <div
            className={`flex ${sizeClass} flex-none items-center justify-center rounded-full font-semibold ${avatar.colorClass}`}
        >
            {avatar.initials}
        </div>
    );
}

// function CommentCard({ comment }: { comment: Comment }) {
//     return (
//         <div className="rounded-xl bg-neutral-100 px-6 py-5">
//             <div className="flex gap-3">
//                 <Avatar avatar={comment.avatar} />
//                 <div className="min-w-0 flex-1">
//           <span className="text-sm font-bold uppercase tracking-wide text-neutral-900">
//             {comment.author}
//           </span>
//                     <p className="mt-1 leading-relaxed text-neutral-800">{comment.body}</p>
//                 </div>
//             </div>
//
//             {comment.replies?.map((reply) => (
//                 <div
//                     key={reply.id}
//                     className="mt-4 ml-5 flex gap-3 border-l-2 border-neutral-200 pl-4"
//                 >
//                     <Avatar avatar={reply.avatar} size="sm" />
//                     <div className="min-w-0 flex-1">
//             <span className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
//               {reply.author}
//             </span>
//                         <p className="mt-1 italic leading-relaxed text-neutral-600">
//                             {reply.body}
//                         </p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

interface Props {
    selectedVerse?: boolean;
    className?: string;

}

export default function CommentsFeed({ selectedVerse, className }: Props) {
    return (
        <div className={" flex w-full max-w-3xl flex-col gap-4 p-6 " + (selectedVerse ? "h-60" : "") + (className ? ` ${className}` : "")}>
            <CommentCard />
            <WriteCommentField />
        </div>
    );
}
