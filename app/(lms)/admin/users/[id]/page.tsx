"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getAdminUser,
  getUserEnrollments,
  manualEnrollUser,
  removeUserEnrollment,
  updateUserRole,
} from "@/lib/api/admin-users";
import { listAdminCourses } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminUser, LmsCourse, LmsRole } from "@/types/lms";
import type { Enrollment } from "@/lib/api/enrollments";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Label, Select } from "@/components/lms/ui/Input";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const { accessToken, user: currentUser } = useAuth();
  const [profile, setProfile] = useState<LmsAdminUser | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [courses, setCourses] = useState<LmsCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingRole, setSavingRole] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const [profileData, enrollmentsData] = await Promise.all([
      getAdminUser(accessToken, params.id),
      getUserEnrollments(accessToken, params.id),
    ]);
    setProfile(profileData);
    setEnrollments(enrollmentsData);
  }, [accessToken, params.id]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function load() {
      try {
        await refresh();
        const courseList = await listAdminCourses(accessToken as string, {
          status: "PUBLISHED",
          limit: 100,
        });
        if (!cancelled) setCourses(courseList.items);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load this user.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, refresh]);

  async function handleRoleChange(role: LmsRole) {
    if (!accessToken) return;
    setSavingRole(true);
    try {
      await updateUserRole(accessToken, params.id, role);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this user's role.");
    } finally {
      setSavingRole(false);
    }
  }

  async function handleEnroll() {
    if (!accessToken || !selectedCourseId) return;
    setEnrolling(true);
    try {
      await manualEnrollUser(accessToken, params.id, selectedCourseId);
      setSelectedCourseId("");
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not enroll this student.");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleRemoveEnrollment(courseId: string) {
    if (!accessToken) return;
    if (!confirm("Remove this enrollment?")) return;
    try {
      await removeUserEnrollment(accessToken, params.id, courseId);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove this enrollment.");
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!profile) return <div className="h-64 animate-pulse rounded-2xl bg-cream" />;

  const enrolledCourseIds = new Set(enrollments?.map((e) => e.course._id));
  const enrollableCourses = courses?.filter((c) => !enrolledCourseIds.has(c._id)) ?? [];

  return (
    <div>
      <Link href="/admin/users" className="text-sm font-semibold text-teal hover:underline">
        ← Back to Users
      </Link>

      <h1 className="mt-2 text-2xl font-bold text-ink">{profile.name}</h1>
      <p className="text-sm text-ink/60">{profile.email}</p>

      <Card className="mt-6">
        <Label htmlFor="user-role">Role</Label>
        <div className="flex items-center gap-3">
          <Select
            id="user-role"
            value={profile.role}
            disabled={profile._id === currentUser?.id}
            onChange={(e) => handleRoleChange(e.target.value as LmsRole)}
            className="max-w-48"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </Select>
          {savingRole && <span className="text-xs text-ink/50">Saving…</span>}
        </div>
        {profile._id === currentUser?.id && (
          <p className="mt-2 text-xs text-ink/50">You can&rsquo;t change your own role.</p>
        )}
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink">Enrolled Courses</h2>
        <div className="mt-4 space-y-3">
          {enrollments?.map((enrollment) => (
            <Card key={enrollment._id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">{enrollment.course.title}</p>
                <p className="text-xs text-ink/50">
                  {enrollment.source} · Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">
                  {enrollment.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveEnrollment(enrollment.course._id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
          {enrollments?.length === 0 && (
            <p className="text-sm text-ink/50">Not enrolled in any courses yet.</p>
          )}
        </div>

        <Card className="mt-4 flex items-center gap-3">
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="flex-1"
          >
            <option value="">Select a published course to enroll…</option>
            {enrollableCourses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </Select>
          <FormButton onClick={handleEnroll} loading={enrolling} disabled={!selectedCourseId}>
            Enroll
          </FormButton>
        </Card>
      </div>
    </div>
  );
}
