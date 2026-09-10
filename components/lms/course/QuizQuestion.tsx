import type { LmsQuizStartQuestion } from "@/types/lms";
import { Input } from "@/components/lms/ui/Input";

export type QuestionAnswerValue = { selectedOptionIds: string[]; textAnswer: string };

export function QuizQuestion({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: LmsQuizStartQuestion;
  value: QuestionAnswerValue;
  onChange: (value: QuestionAnswerValue) => void;
}) {
  function toggleOption(optionId: string) {
    if (question.type === "MULTIPLE_CHOICE") {
      const isSelected = value.selectedOptionIds.includes(optionId);
      onChange({
        ...value,
        selectedOptionIds: isSelected
          ? value.selectedOptionIds.filter((id) => id !== optionId)
          : [...value.selectedOptionIds, optionId],
      });
    } else {
      onChange({ ...value, selectedOptionIds: [optionId] });
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="font-semibold text-ink">
        {index + 1}. {question.text}
        <span className="ml-2 text-xs font-normal text-ink/40">
          {question.points} {question.points === 1 ? "point" : "points"}
        </span>
      </p>

      {question.type === "SHORT_ANSWER" ? (
        <Input
          className="mt-3"
          placeholder="Your answer"
          value={value.textAnswer}
          onChange={(e) => onChange({ ...value, textAnswer: e.target.value })}
        />
      ) : (
        <div className="mt-3 space-y-2">
          {question.options.map((option) => {
            const checked = value.selectedOptionIds.includes(option._id);
            return (
              <label
                key={option._id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  checked ? "border-teal bg-teal/5" : "border-ink/10 hover:border-ink/20"
                }`}
              >
                <input
                  type={question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                  name={`question-${question._id}`}
                  checked={checked}
                  onChange={() => toggleOption(option._id)}
                />
                {option.text}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
