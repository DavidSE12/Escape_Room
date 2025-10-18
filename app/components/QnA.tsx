// QnA.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

type Mode = "answer" | "create";

export default function QuizzCard({
  mode,
  quizId: _quizId,
  question,
  hint,
  onClose,
  onSubmitAnswer,
  onCreate,
}: {
  mode: Mode;
  quizId: string;
  question?: string;
  hint?: string;
  onClose?: () => void;
  onSubmitAnswer?: (answer: string) => void;
  onCreate?: (data: { question: string; answer: string; hint?: string }) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newHint, setNewHint] = useState("");
  const [showHint, setShowHint] = useState(false);

  const isCreate = mode === "create";

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-[1000px] h-[560px]">
        <Image src="/paper.png" alt="Paper Background" fill className="object-cover" priority />

        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 pt-16">
          {/* Title and Close */}
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Question</h2>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg border text-xs hover:bg-black/5"
            >
              Close
            </button>
          </div>

          {/* Question Field */}
          {isCreate ? (
            <div className="w-full mb-4">
              <label className="block text-sm text-slate-700 mb-1">Question text</label>
              <textarea
                className="w-full h-28 rounded-lg border bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 p-3 text-gray-800 text-sm"
                placeholder="Enter your question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
          ) : (
            <div className="w-full mb-4">
              <p className="rounded-lg border bg-white/70 p-3 text-gray-800 text-sm min-h-24 whitespace-pre-wrap">
                {question}
              </p>
            </div>
          )}

          {/* Answer Field */}
          <div className="w-full mb-2">
            <label className="block text-sm text-slate-700 mb-1">
              {isCreate ? "Correct answer" : "Your answer"}
            </label>
            <input
              className="w-full rounded-lg border bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 p-3 text-gray-800 text-sm"
              placeholder={isCreate ? "Type the correct answer..." : "Type your answer..."}
              value={isCreate ? newAnswer : answer}
              onChange={(e) => (isCreate ? setNewAnswer(e.target.value) : setAnswer(e.target.value))}
            />
          </div>

          {/* Hint */}
          <div className="w-full mt-2">
            {isCreate ? (
              <div className="flex flex-col gap-1">
                <label className="block text-sm text-slate-700">Hint (optional)</label>
                <input
                  className="w-full rounded-lg border bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 p-3 text-gray-800 text-sm"
                  placeholder="Provide a hint (optional)"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHint((v) => !v)}
                  className="px-4 py-2 rounded-lg border text-sm hover:bg-black/5"
                >
                  {showHint ? "Hide hint" : "Show hint"}
                </button>
                {showHint && hint && (
                  <div className="text-xs px-2 py-1 rounded border bg-yellow-50 text-yellow-900">
                    {hint}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 self-start">
            {isCreate ? (
              <button
                onClick={() =>
                  onCreate?.({
                    question: newQuestion.trim(),
                    answer: newAnswer.trim(),
                    hint: newHint.trim() || undefined,
                  })
                }
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow disabled:opacity-50"
                disabled={!newQuestion.trim() || !newAnswer.trim()}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => onSubmitAnswer?.(answer)}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow disabled:opacity-50"
                disabled={!answer.trim()}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
