"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateProfile } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/lms/ui/Card";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { FormButton } from "@/components/lms/ui/FormButton";
import type { LmsUser } from "@/types/lms";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  // Keying on user.id guarantees this remounts (and re-reads user.name into
  // local state) if a different account is ever logged into in the same tab.
  return <ProfileView key={user.id} user={user} />;
}

function ProfileView({ user }: { user: LmsUser }) {
  const { accessToken } = useAuth();
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
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-ink">Profile</h1>
      <p className="mt-1 text-sm text-ink/60">
        {user.email} &middot; {user.role}
      </p>

      <Card className="mt-6">
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
    </div>
  );
}
