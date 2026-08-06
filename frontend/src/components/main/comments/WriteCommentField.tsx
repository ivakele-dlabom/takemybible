import { useState } from "react";
import {
  Field,
  FieldDescription,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  className?: string;
  verseId: number;
  parentCommentId?: number | null;
  onCommentPosted?: () => void;
}

export default function WriteCommentField({
  className,
  verseId,
  parentCommentId = null,
  onCommentPosted,
}: Props) {
  const { token, isAuthenticated } = useAuth();
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!body.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:9090/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          verseId,
          body: body.trim(),
          parentCommentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post comment");
      }

      setBody("");
      onCommentPosted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <p className={className + " text-sm text-neutral-400"}>
        Log in to post a comment.
      </p>
    );
  }

  return (
    <Field className={className}>
      <FieldDescription>Enter your comment.</FieldDescription>
      <Textarea
        id="textarea-message"
        placeholder="Type your message here."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !body.trim()}
        className="mt-2 self-end"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </Field>
  );
}
