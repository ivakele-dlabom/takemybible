import { Lightbulb, MessageSquare, Heart, ChevronDown } from "lucide-react";

interface Reply {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  timestamp: string;
  body: string;
}

interface Comment {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  timestamp: string;
  body: string;
  insightfulCount: number;
  replies?: Reply[];
}

const comments: Comment[] = [
  {
    id: "1",
    author: "Dr. Elara Vance",
    initials: "EV",
    avatarColor: "bg-amber-200 text-amber-900",
    timestamp: "2h ago",
    body: "The linguistic structure here suggests a completed totality. The term 'host' (tsaba) implies an organized, multi-layered cosmic order, not merely a collection of objects. This transition from chaos to 'finished' order is the crucial ontological shift.",
    insightfulCount: 4,
    replies: [
      {
        id: "1-1",
        author: "Julian Marx",
        initials: "JM",
        avatarColor: "bg-neutral-300 text-neutral-800",
        timestamp: "45m ago",
        body: "Does 'finished' here imply a cessation of creative energy, or simply the completion of the foundational blueprint?",
      },
    ],
  },
  {
    id: "2",
    author: "Prof. Arthur Hawthorne",
    initials: "AH",
    avatarColor: "bg-emerald-200 text-emerald-900",
    timestamp: "5h ago",
    body: "Note the chiastic symmetry in the broader context. This verse serves as the resolution to the opening 'In the beginning'. The 'heavens and earth' wrap around the entire creative narrative like a literary parenthesis.",
    insightfulCount: 12,
  },
];

function Avatar({
  initials,
  colorClass,
  size = "md",
}: {
  initials: string;
  colorClass: string;
  size?: "sm" | "md";
}) {
  // TODO: Profile picture
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div
      className={`flex ${sizeClass} flex-none items-center justify-center rounded-full font-semibold ${colorClass}`}
    >
      {initials}
    </div>
  );
}

function ActionRow({ insightfulCount }: { insightfulCount: number }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-5 text-xs font-semibold text-neutral-500">

      <button className="flex items-center gap-1.5 hover:text-neutral-700">
        <button className="hover:underline">Reply</button>
      </button>
      <button className="flex self-right items-center gap-1.5 hover:text-neutral-700">
        <Heart size={30} strokeWidth={2} />
        <span>12k</span>
      </button>
    </div>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className=" bg-white px-6 py-5 ">
      <div className="flex gap-3">
        <Avatar initials={comment.initials} colorClass={comment.avatarColor} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm font-bold uppercase tracking-wide text-neutral-900">
              {comment.author}
            </span>
            <span className="flex-none text-xs font-medium text-neutral-500">
              {comment.timestamp.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-left leading-relaxed text-neutral-800">
            {comment.body}
          </p>
          <ActionRow insightfulCount={comment.insightfulCount} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <hr className="w-10 h-4 rounded-full" />
        <span>View replies ({comment.replies?.length ?? 0})</span>
        <ChevronDown className="ml-2" />
      </div>
    </div>
  );
}

export default function DiscussionFeed() {
  return (
    <div className="ml-4 flex w-full max-w-3xl flex-col p-6">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
