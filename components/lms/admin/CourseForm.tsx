"use client";

import { useEffect, useState, type FormEvent } from "react";
import { listCategories, type CourseInput } from "@/lib/api/courses";
import type { LmsCategory, LmsCourse } from "@/types/lms";
import { ApiError } from "@/lib/api/client";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Select, Textarea, FieldError } from "@/components/lms/ui/Input";

export function CourseForm({
  initialCourse,
  onSubmit,
  submitLabel,
}: {
  initialCourse?: LmsCourse;
  onSubmit: (input: Omit<CourseInput, "instructor">) => Promise<void>;
  submitLabel: string;
}) {
  const [categories, setCategories] = useState<LmsCategory[]>([]);
  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialCourse?.shortDescription ?? "",
  );
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [category, setCategory] = useState(
    typeof initialCourse?.category === "object" ? initialCourse.category._id : "",
  );
  const [difficultyLevel, setDifficultyLevel] = useState<LmsCourse["difficultyLevel"]>(
    initialCourse?.difficultyLevel ?? "BEGINNER",
  );
  const [duration, setDuration] = useState(initialCourse?.duration ?? "");
  const [price, setPrice] = useState(String(initialCourse?.price ?? 0));
  const [status, setStatus] = useState<LmsCourse["status"]>(initialCourse?.status ?? "DRAFT");
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
        category,
        difficultyLevel,
        duration,
        price: Number(price),
        status,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this course.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
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
        <Textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
      </div>

      <FieldError message={error} />

      <FormButton type="submit" loading={isSubmitting}>
        {submitLabel}
      </FormButton>
    </form>
  );
}
