"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminUsers } from "@/lib/api/admin-users";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminUser } from "@/types/lms";
import { Input } from "@/components/lms/ui/Input";
import { Reveal } from "@/components/motion/Reveal";

export default function AdminInstructorsPage() {
  const { accessToken } = useAuth();
  const [instructors, setInstructors] = useState<LmsAdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAdminUsers(accessToken, { role: "INSTRUCTOR", search: search || undefined, limit: 50 })
      .then((result) => {
        if (!cancelled) setInstructors(result.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setInstructors([]);
        setError(err instanceof ApiError ? err.message : "Could not load instructors.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Instructors</h1>
      <p className="mt-1 text-sm text-ink/60">Everyone with the Instructor role.</p>

      <div className="mt-6">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {instructors === null &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={4}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {instructors?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={4}>
                  No instructors found.
                </td>
              </tr>
            )}

            {instructors?.map((u) => (
              <tr key={u._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink/70">{u.email}</td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u._id}`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
