import  { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";

interface Reply {
    id: string;
    author: string;
    body: string;
    date: string;
}

interface CommentData {
    author: string;
    body: string;
    date: string;
    likeCount: number;
    replies: Reply[];
}

const comment: CommentData = {
    author: "Connie Duplissis",
    body: "marriage is amazing when you are married to your best friend, enjoy darling 🥰",
    date: "4-10",
    likeCount: 880,
    replies: [
        {
            id: "1",
            author: "Someone",
            body: "So happy for you both!",
            date: "4-11",
        },
        {
            id: "2",
            author: "Another Person",
            body: "Goals honestly 😍",
            date: "4-12",
        },
    ],
};

export default function CommentCard() {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likeCount);
    const [showReplies, setShowReplies] = useState(false);

    const toggleLike = () => {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    };

    return (
        <div className="w-full max-w-xl bg-white px-4 py-5 text-black">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-black w-fit">{comment.author}</p>
                    <p className="mt-2 text-left leading-snug text-black w-fit">{comment.body}</p>

                    <div className="mt-3 flex items-center gap-4 text-sm text-neutral-400">
                        <span>{comment.date}</span>
                        <button className="font-medium text-black  hover:text-white">
                            Reply
                        </button>
                    </div>

                    {comment.replies.length > 0 && (
                        <button
                            onClick={() => setShowReplies((prev) => !prev)}
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white"
                        >
                            <span className="h-px w-6 bg-neutral-600" />
                            <span className="text-black">
                            {showReplies ? "Hide" : "View"} {comment.replies.length}{" "}
                                            {comment.replies.length === 1 ? "reply" : "replies"}
                          </span>
                            <ChevronDown
                                color={"black"}
                                size={16}
                                className={`transition-transform ${showReplies ? "rotate-180" : ""}` + " outline-black"}
                            />

                        </button>
                    )}

                    <span className="h-px w-6 bg-neutral-600" />
                    {showReplies && (
                        <div className="mt-3 flex flex-col gap-4 border-l border-neutral-800 pl-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id}>
                                    <p className="font-semibold text-black">{reply.author}</p>
                                    <p className="mt-1 leading-snug text-black">{reply.body}</p>
                                    <span className="mt-2 block text-sm text-neutral-400">
                    {reply.date}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={toggleLike}
                    className="flex flex-none flex-col items-center gap-1 text-neutral-400 hover:text-white"
                >
                    <Heart
                        size={22}
                        strokeWidth={2}
                        className={liked ? "fill-red-500 text-red-500" : ""}
                    />
                    <span className="text-sm">{likeCount}</span>
                </button>
            </div>
        </div>
    );
}