"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminUsers } from "@/lib/api/admin-users";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminUser, LmsRole } from "@/types/lms";
import { Input, Select } from "@/components/lms/ui/Input";

const ROLE_STYLES: Record<LmsRole, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN: "bg-teal/15 text-teal",
  INSTRUCTOR: "bg-amber-100 text-amber-700",
  STUDENT: "bg-ink/10 text-ink/60",
};

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<LmsAdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<LmsRole | "">("");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAdminUsers(accessToken, { search: search || undefined, role: role || undefined, limit: 50 })
      .then((result) => {
        if (!cancelled) setUsers(result.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setUsers([]);
        setError(err instanceof ApiError ? err.message : "Could not load users.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, search, role]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Users</h1>
      <p className="mt-1 text-sm text-ink/60">Search, filter, and manage platform users.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as LmsRole | "")}
          className="max-w-40"
        >
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </Select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {users === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={5}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {users?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={5}>
                  No users found.
                </td>
              </tr>
            )}

            {users?.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink/70">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[u.role]}`}
                  >
                    {u.role}
                  </span>
                </td>
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
      </div>
    </div>
  );
}
