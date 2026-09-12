"use client";

import { useEffect, useState, type FormEvent } from "react";
import { listCategories, type CourseInput } from "@/lib/api/courses";
import type { LmsCategory, LmsCourse } from "@/types/lms";
import { ApiError } from "@/lib/api/client";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Select, FieldError } from "@/components/lms/ui/Input";
import { RichTextEditor } from "@/components/lms/ui/RichTextEditor";
import { Switch } from "@/components/lms/ui/Switch";

export function CourseForm({
  initialCourse,
  onSubmit,
  submitLabel,
  canPublish = true,
}: {
  initialCourse?: LmsCourse;
  onSubmit: (input: Omit<CourseInput, "instructor">) => Promise<void>;
  submitLabel: string;
  /** false for instructors — they submit for review instead of publishing directly. */
  canPublish?: boolean;
}) {
  const [categories, setCategories] = useState<LmsCategory[]>([]);
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialCourse?.shortDescription ?? "",
  );
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialCourse?.featuredImage ?? "");
  const [brochureUrl, setBrochureUrl] = useState(initialCourse?.brochureUrl ?? "");
  const [category, setCategory] = useState(
    typeof initialCourse?.category === "object" ? initialCourse.category._id : "",
  );
  const [difficultyLevel, setDifficultyLevel] = useState<LmsCourse["difficultyLevel"]>(
    initialCourse?.difficultyLevel ?? "BEGINNER",
  );
  const [duration, setDuration] = useState(initialCourse?.duration ?? "");
  const [price, setPrice] = useState(String(initialCourse?.price ?? 0));
  const [status, setStatus] = useState<LmsCourse["status"]>(initialCourse?.status ?? "DRAFT");
  const [certificateEnabled, setCertificateEnabled] = useState(
    initialCourse?.certificateEnabled ?? false,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!category) {
      setError("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        shortDescription,
        description,
        featuredImage: featuredImage.trim() || undefined,
        brochureUrl: brochureUrl.trim() || undefined,
        category,
        difficultyLevel,
        duration,
        price: Number(price),
        status,
        certificateEnabled,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this course.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input
          id="shortDescription"
          maxLength={300}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Full description</Label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe what this course covers…"
        />
      </div>

      <div>
        <Label htmlFor="featuredImage">Featured image URL</Label>
        <div className="flex items-start gap-3">
          <Input
            id="featuredImage"
            placeholder="https://example.com/course-cover.jpg"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="flex-1"
          />
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-ink/5">
            {featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featuredImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] font-semibold text-ink/40">IMG</span>
            )}
          </div>
        </div>
        <p className="mt-1.5 text-xs text-ink/50">
          Shown on the course card, the course detail page, and as the fallback module image.
        </p>
      </div>

      <div>
        <Label htmlFor="brochureUrl">Brochure URL (PDF)</Label>
        <Input
          id="brochureUrl"
          placeholder="https://example.com/course-brochure.pdf"
          value={brochureUrl}
          onChange={(e) => setBrochureUrl(e.target.value)}
        />
        <p className="mt-1.5 text-xs text-ink/50">
          Optional. When set, a &ldquo;Download Brochure&rdquo; button appears on this course&rsquo;s
          public page. Leave blank to hide it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="difficultyLevel">Difficulty</Label>
          <Select
            id="difficultyLevel"
            value={difficultyLevel}
            onChange={(e) =>
              setDifficultyLevel(e.target.value as LmsCourse["difficultyLevel"])
            }
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g. 6 weeks"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as LmsCourse["status"])}
        >
          <option value="DRAFT">Draft</option>
          {status === "PENDING_REVIEW" && (
            <option value="PENDING_REVIEW" disabled>
              Pending Review (waiting on admin)
            </option>
          )}
          {canPublish && <option value="PUBLISHED">Published</option>}
          <option value="ARCHIVED">Archived</option>
        </Select>
        {!canPublish && (
          <p className="mt-1.5 text-xs text-ink/50">
            Instructors can&rsquo;t publish directly — save as Draft, then use &ldquo;Submit for
            Review&rdquo; below.
          </p>
        )}
      </div>

      <div>
        <Switch
          checked={certificateEnabled}
          onChange={setCertificateEnabled}
          label="Award a certificate on completion"
        />
        <p className="mt-1.5 text-xs text-ink/50">
          When enabled, a student who passes every final assessment (or, for
          courses with none, finishes every lesson) automatically gets a
          certificate using the template configured under Certificates.
        </p>
      </div>

      <FieldError message={error} />

      <FormButton type="submit" loading={isSubmitting}>
        {submitLabel}
      </FormButton>
    </form>
  );
}
