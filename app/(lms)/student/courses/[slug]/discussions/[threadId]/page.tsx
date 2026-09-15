"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { createReply, deleteOwnReply, deleteOwnThread, getThread } from "@/lib/api/forum";
import { ApiError } from "@/lib/api/client";
import type { LmsForumThreadWithReplies } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Textarea, FieldError } from "@/components/lms/ui/Input";

export default function ThreadDetailPage() {
  const params = useParams<{ slug: string; threadId: string }>();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [data, setData] = useState<LmsForumThreadWithReplies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setData(await getThread(params.threadId, accessToken));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this thread.");
    }
  }, [params.threadId, accessToken]);

  useEffect(() => {
    async function load() {
      await refresh();
    }
    load();
  }, [refresh]);

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !reply.trim()) return;
    setReplyError(null);
    setIsSubmitting(true);
    try {
      await createReply(accessToken, params.threadId, reply.trim());
      setReply("");
      await refresh();
    } catch (err) {
      setReplyError(err instanceof ApiError ? err.message : "Could not post this reply.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteThread() {
    if (!accessToken) return;
    if (!confirm("Delete this thread and all its replies?")) return;
    await deleteOwnThread(accessToken, params.threadId);
    router.push(`/student/courses/${params.slug}/discussions`);
  }

  async function handleDeleteReply(replyId: string) {
    if (!accessToken) return;
    if (!confirm("Delete this reply?")) return;
    await deleteOwnReply(accessToken, replyId);
    await refresh();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <div className="h-40 animate-pulse rounded-2xl bg-white" />;

  const { thread, replies } = data;
  const isOwnThread = user?.id === thread.author._id;

  return (
    <div>
      <Link
        href={`/student/courses/${params.slug}/discussions`}
        className="text-sm font-semibold text-teal hover:underline"
      >
        ← All discussions
      </Link>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-ink">
              {thread.pinned && "📌 "}
              {thread.title}
            </h1>
            <p className="mt-1 text-xs text-ink/50">
              {thread.author.name} · {new Date(thread.createdAt).toLocaleString()}
            </p>
          </div>
          {isOwnThread && (
            <button
              type="button"
              onClick={handleDeleteThread}
              className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">{thread.body}</p>
      </Card>

      <div className="mt-6 space-y-3">
        {replies.map((r) => (
          <Card key={r._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{r.author.name}</p>
                <p className="text-xs text-ink/40">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              {user?.id === r.author._id && (
                <button
                  type="button"
                  onClick={() => handleDeleteReply(r._id)}
                  className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{r.body}</p>
          </Card>
        ))}
        {replies.length === 0 && (
          <p className="text-sm text-ink/40">No replies yet — be the first to respond.</p>
        )}
      </div>

      <Card className="mt-6">
        <form onSubmit={handleReply} className="space-y-3">
          <Textarea
            placeholder="Write a reply…"
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <FieldError message={replyError} />
          <FormButton type="submit" loading={isSubmitting} disabled={!reply.trim()}>
            Post Reply
          </FormButton>
        </form>
      </Card>
    </div>
  );
}
