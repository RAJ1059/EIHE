"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  deleteUser,
  listAdminUsers,
  setUserActive,
  triggerUserPasswordReset,
} from "@/lib/api/admin-users";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminUser, LmsRole } from "@/types/lms";
import { Input, Select } from "@/components/lms/ui/Input";
import { PencilIcon, KeyIcon, LockIcon, UnlockIcon, TrashIcon } from "@/components/ui/icons";

const ROLE_STYLES: Record<LmsRole, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN: "bg-teal/15 text-teal",
  INSTRUCTOR: "bg-amber-100 text-amber-700",
  STUDENT: "bg-ink/10 text-ink/60",
};

type DerivedStatus = "active" | "pending" | "suspended";

function statusFor(u: LmsAdminUser): DerivedStatus {
  if (!u.isActive) return "suspended";
  if (!u.emailVerified) return "pending";
  return "active";
}

const STATUS_STYLES: Record<DerivedStatus, string> = {
  active: "bg-teal/15 text-teal",
  pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
};

export default function AdminUsersPage() {
  const { accessToken, user: currentUser } = useAuth();
  const [users, setUsers] = useState<LmsAdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<LmsRole | "">("");
  const [status, setStatus] = useState<DerivedStatus | "">("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function load() {
    if (!accessToken) return;
    listAdminUsers(accessToken, { search: search || undefined, role: role || undefined, limit: 50 })
      .then((result) => setUsers(result.items))
      .catch((err) => {
        setUsers([]);
        setError(err instanceof ApiError ? err.message : "Could not load users.");
      });
  }

  useEffect(load, [accessToken, search, role]);

  const visibleUsers = status ? users?.filter((u) => statusFor(u) === status) : users;

  async function handleToggleActive(target: LmsAdminUser) {
    if (!accessToken) return;
    const isActive = !target.isActive;
    const confirmed = window.confirm(
      isActive
        ? `Reactivate ${target.name}'s account?`
        : `Suspend ${target.name}'s account? They won't be able to log in until reactivated.`,
    );
    if (!confirmed) return;

    setBusyId(target._id);
    setError(null);
    setNotice(null);
    try {
      await setUserActive(accessToken, target._id, isActive);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleResetPassword(target: LmsAdminUser) {
    if (!accessToken) return;
    setBusyId(target._id);
    setError(null);
    setNotice(null);
    try {
      await triggerUserPasswordReset(accessToken, target._id);
      setNotice(`Password reset link sent to ${target.email}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send a reset link.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(target: LmsAdminUser) {
    if (!accessToken) return;
    const confirmed = window.confirm(
      `Permanently delete ${target.name}'s account? Their enrollments and learning progress will be removed too. This can't be undone.`,
    );
    if (!confirmed) return;

    setBusyId(target._id);
    setError(null);
    setNotice(null);
    try {
      await deleteUser(accessToken, target._id);
      setUsers((prev) => prev?.filter((u) => u._id !== target._id) ?? prev);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this account.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Users</h1>
      <p className="mt-1 text-sm text-ink/60">Search, filter, edit and manage platform users.</p>

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
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as DerivedStatus | "")}
          className="max-w-40"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {notice && !error && <p className="mt-6 text-sm text-teal">{notice}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {visibleUsers === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {visibleUsers?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}

            {visibleUsers?.map((u) => {
              const derived = statusFor(u);
              const isSelf = u._id === currentUser?.id;
              const busy = busyId === u._id;
              return (
                <tr key={u._id} className="transition-colors hover:bg-cream/60">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[derived]}`}
                    >
                      {derived}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users/${u._id}`}
                        title="Edit"
                        className="text-ink/50 hover:text-teal"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        title="Send password reset"
                        disabled={busy}
                        onClick={() => handleResetPassword(u)}
                        className="text-ink/50 hover:text-teal disabled:opacity-40"
                      >
                        <KeyIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={u.isActive ? "Suspend" : "Reactivate"}
                        disabled={busy || isSelf}
                        onClick={() => handleToggleActive(u)}
                        className="text-ink/50 hover:text-amber-600 disabled:opacity-40"
                      >
                        {u.isActive ? (
                          <LockIcon className="h-4 w-4" />
                        ) : (
                          <UnlockIcon className="h-4 w-4" />
                        )}
                      </button>
                      {currentUser?.role === "SUPER_ADMIN" && (
                        <button
                          type="button"
                          title="Delete"
                          disabled={busy || isSelf}
                          onClick={() => handleDelete(u)}
                          className="text-ink/50 hover:text-red-600 disabled:opacity-40"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
