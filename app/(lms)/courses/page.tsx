"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCourses, type CourseQuery } from "@/lib/api/courses";
import type { LmsCourse } from "@/types/lms";
import { ApiError } from "@/lib/api/client";

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<LmsCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<CourseQuery>({});

  useEffect(() => {
    let cancelled = false;

    listCourses(query)
      .then((result) => {
        if (cancelled) return;
        setCourses(result.items);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setCourses([]);
        setError(err instanceof ApiError ? err.message : "Could not load courses.");
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
          Courses
        </h1>
        <p className="mt-3 max-w-2xl text-ink/70">
          Browse published EIHE programs and enroll to start learning.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery((prev) => ({ ...prev, search, page: 1 }));
          }}
          className="mt-8 flex max-w-md gap-2"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-teal focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

        {courses === null && !error && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        )}

        {courses !== null && courses.length === 0 && !error && (
          <p className="mt-12 text-ink/60">No courses found.</p>
        )}

        {courses !== null && courses.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course.slug}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-cream shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-40 w-full bg-ink/5">
                  {course.featuredImage && (
                    // next/image needs remote hosts allowlisted in next.config.ts; skipping that for this slice.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.featuredImage}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-sage">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {course.shortDescription}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-ink">
                    {course.salePrice != null ? (
                      <>
                        <span className="mr-2 text-ink/40 line-through">
                          {course.currency} {course.price}
                        </span>
                        {course.currency} {course.salePrice}
                      </>
                    ) : course.price === 0 ? (
                      "Free"
                    ) : (
                      `${course.currency} ${course.price}`
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
