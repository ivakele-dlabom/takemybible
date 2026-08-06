import { useEffect, useState } from "react";
import WriteCommentField from "./WriteCommentField.tsx";

interface CommentData {
    id: number;
    author: string;
    body: string;
    likeCount: number;
    createdAt: string;
}

interface Props {
    className?: string;
    verseId: number | null;
}

export default function CommentsFeed({ className, verseId }: Props) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        if (!verseId) return;

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:9090/api/comments/verse/${verseId}`
            );
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setComments([]);
        fetchComments();
    }, [verseId]);

    if (!verseId) {
        return (
            <div className={className + " flex w-full max-w-100 flex-col items-center justify-center p-6 text-neutral-400"}>
                <p>Select a verse to view comments.</p>
            </div>
        );
    }

    return (
        <div className={className + " flex w-full max-w-100 flex-col gap-4 p-6 h-165"}>
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Comments
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3">
                {loading && <p className="text-sm text-neutral-400">Loading comments...</p>}

                {!loading && comments.length === 0 && (
                    <p className="text-sm text-neutral-400">No comments yet. Be the first!</p>
                )}

                {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-neutral-100 bg-white px-4 py-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-900">{comment.author}</span>
                            <span className="text-xs text-neutral-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700">{comment.body}</p>
                        {comment.likeCount > 0 && (
                            <span className="mt-2 inline-block text-xs text-neutral-400">
                                {comment.likeCount} {comment.likeCount === 1 ? "like" : "likes"}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <WriteCommentField
                className="mt-auto w-full max-h-60"
                verseId={verseId}
                onCommentPosted={fetchComments}
            />
        </div>
    );
}
