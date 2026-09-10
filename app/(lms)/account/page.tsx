"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateProfile } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/lms/ui/Card";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { FormButton } from "@/components/lms/ui/FormButton";
import type { LmsUser } from "@/types/lms";

export default function MyAccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>
    );
  }

  // Keying on user.id guarantees this remounts (and re-reads user.name into
  // local state) if a different account is ever logged into in the same tab.
  return <AccountView key={user.id} user={user} />;
}

function AccountView({ user }: { user: LmsUser }) {
  const { accessToken, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setError(null);
    setSuccess(false);
    setIsSaving(true);
    try {
      await updateProfile(accessToken, { name });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">My Account</h1>
        <p className="mt-2 text-sm text-ink/60">
          {user.email} &middot; {user.role}
        </p>

        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <span className="text-teal">My Account</span>
          <Link href="/account/courses" className="text-ink/60 hover:text-teal">
            My Courses
          </Link>
          <Link href="/cart" className="text-ink/60 hover:text-teal">
            My Cart
          </Link>
        </div>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <FieldError message={error} />
            {success && <p className="text-xs text-teal">Profile updated.</p>}

            <FormButton type="submit" loading={isSaving}>
              Save Changes
            </FormButton>
          </form>
        </Card>

        <button
          onClick={() => logout().then(() => router.push("/login"))}
          className="mt-6 text-sm font-semibold text-ink/60 hover:text-ink"
        >
          Log Out
        </button>
      </div>
    </section>
  );
}
