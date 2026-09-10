"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card } from "@/components/lms/ui/Card";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-ink/60">Role: {user?.role}</p>

      <Card className="mt-8">
        <p className="text-sm text-ink/70">
          This dashboard is a placeholder for this phase. Real metrics (total
          students, enrollments, revenue, quiz attempts) depend on the
          Enrollments, Orders, and Quiz modules built in later phases — they
          are intentionally not faked here.
        </p>
        <Link
          href="/admin/courses"
          className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
        >
          Go to Course management →
        </Link>
      </Card>
    </div>
  );
}
