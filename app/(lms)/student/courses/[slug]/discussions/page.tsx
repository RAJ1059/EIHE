"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { createThread, listThreads } from "@/lib/api/forum";
import { ApiError } from "@/lib/api/client";
import type { LmsForumThread } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Textarea, FieldError } from "@/components/lms/ui/Input";

export default function CourseDiscussionsPage() {
  const params = useParams<{ slug: string }>();
  const { accessToken } = useAuth();
  const [threads, setThreads] = useState<LmsForumThread[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setThreads(await listThreads(params.slug, accessToken));
    } catch (err) {
      setThreads([]);
      setError(err instanceof ApiError ? err.message : "Could not load discussions.");
    }
  }, [params.slug, accessToken]);

  useEffect(() => {
    async function load() {
      await refresh();
    }
    load();
  }, [refresh]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Discussions</h1>
          <p className="mt-1 text-sm text-ink/60">
            Ask questions and discuss this course with your instructor and fellow students.
          </p>
        </div>
        <FormButton onClick={() => setShowNewThread((v) => !v)} variant="secondary">
          {showNewThread ? "Cancel" : "+ New Thread"}
        </FormButton>
      </div>

      {showNewThread && (
        <NewThreadForm
          onCreated={() => {
            setShowNewThread(false);
            refresh();
          }}
        />
      )}

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {threads === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}

        {threads?.length === 0 && (
          <Card className="text-center">
            <p className="text-ink/70">No discussions yet. Start the first one!</p>
          </Card>
        )}

        {threads?.map((thread) => (
          <Link key={thread._id} href={`/student/courses/${params.slug}/discussions/${thread._id}`}>
            <Card hoverable>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {thread.pinned && "📌 "}
                    {thread.title}
                  </p>
                  <p className="mt-1 truncate text-sm text-ink/60">{thread.body}</p>
                  <p className="mt-2 text-xs text-ink/40">
                    {thread.author.name} · {new Date(thread.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                  {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewThreadForm({ onCreated }: { onCreated: () => void }) {
  const params = useParams<{ slug: string }>();
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await createThread(accessToken, params.slug, title.trim(), body.trim());
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create this thread.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="thread-title">Title</Label>
          <Input id="thread-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="thread-body">Your question or comment</Label>
          <Textarea
            id="thread-body"
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <FieldError message={error} />
        <FormButton type="submit" loading={isSubmitting} disabled={!title.trim() || !body.trim()}>
          Post Thread
        </FormButton>
      </form>
    </Card>
  );
}
