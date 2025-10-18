"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import Hotspot3D from "./HotSpot3D";
import QuizzCard from "./QnA";

type ApiQuestion = {
  id: number;
  question: string;
  answer: string;
  hint?: string;
};

type QuizData = {
	id: string;
	question?: string;
	answer?: string;
	hint?: string;
};

export default function EscapeRoomOrbit() {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  // Intro modal & timer
  const [showIntro, setShowIntro] = useState<boolean>(true);
  // keep input as string so users can clear it to empty
  const [secondsInput, setSecondsInput] = useState<string>("");
  // timeLeft is null until the user sets a valid time
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [, setInitialTimeSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [q1, setQ1] = useState<QuizData>({ id: "q1" });
  const [q2, setQ2] = useState<QuizData>({ id: "q2" });
  const [q3, setQ3] = useState<QuizData>({ id: "q3" });
  const [q4, setQ4] = useState<QuizData>({ id: "q4" });
  const [, setFeedback] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [successText, setSuccessText] = useState<string>("Correct!");
  const [errorText, setErrorText] = useState<string>("Incorrect. Try again.");
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [showWin, setShowWin] = useState<boolean>(false);
  const [showFail, setShowFail] = useState<boolean>(false);
  const [correct, setCorrect] = useState<{ q1: boolean; q2: boolean; q3: boolean; q4: boolean }>({ q1: false, q2: false, q3: false, q4: false });

  // Win form state for dropping questions
  const [showWinForm, setShowWinForm] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [newHint, setNewHint] = useState<string>("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState<boolean>(false);

  // Load from API/local for q1 - q4
  useEffect(() => {
    (async () => {
      try {
        // your API already returns 4 random items
        const res = await fetch("/api/questions?limit=4", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const items: ApiQuestion[] = await res.json();

        // defensively map the first 4 (or fewer if DB has less)
        const a = items[0];
        const b = items[1];
        const c = items[2];
        const d = items[3];

        if (a) setQ1({ id: "q1", question: a.question, answer: a.answer, hint: a.hint });
        if (b) setQ2({ id: "q2", question: b.question, answer: b.answer, hint: b.hint });
        if (c) setQ3({ id: "q3", question: c.question, answer: c.answer, hint: c.hint });
        if (d) setQ4({ id: "q4", question: d.question, answer: d.answer, hint: d.hint });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Load questions failed:", err);
        }
      }
    })();

  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerRunning || timeLeft === null) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        return prev <= 1 ? 0 : prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerRunning(false);
      // If time runs out before finishing all answers, show failure
      if (!(correct.q1 && correct.q2 && correct.q3 && correct.q4)) {
        setShowFail(true);
      }
    }
  }, [timeLeft, correct]);

  function parseAndClampSeconds(input: string): number | null {
    if (input.trim() === "") return null;
    const n = Number(input);
    if (!Number.isFinite(n)) return null;
    const c = Math.max(10, Math.min(3600, Math.floor(n)));
    return c;
  }

  function handleTimerStart(): boolean {
    let next = timeLeft;
    if (next === null || next <= 0) {
      const c = parseAndClampSeconds(secondsInput);
      if (c === null) {
        setTimerRunning(false);
        return false;
      }
      setInitialTimeSeconds(c);
      next = c;
      setTimeLeft(c);
    }
    setTimerRunning(true);
    return true;
  }

  function handleTimerPause() {
    setTimerRunning(false);
  }
  const m = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
  const s = timeLeft !== null ? timeLeft % 60 : 0;


  function handleSubmitAnswer(quizId: string, userAnswer: string) {
    const normalized = userAnswer.trim().toLowerCase();
    const quiz = quizId === "q1" ? q1 : quizId === "q2" ? q2 : quizId === "q3" ? q3 : q4;
    if (!quiz.answer) {
      setFeedback("No answer set yet. Create the question first.");
      return;
    }
    if (normalized === quiz.answer.trim().toLowerCase()) {
      setFeedback("");
      // determine how many were correct BEFORE this one to pick a message for 1-3
      const numCorrectBefore = (correct.q1 ? 1 : 0) + (correct.q2 ? 1 : 0) + (correct.q3 ? 1 : 0) + (correct.q4 ? 1 : 0);
      const successMessages = [
        "You did it! The path ahead opens.",
        "Another secret revealed…",
        "Nice work! You're getting closer to freedom.",
      ];
      if (numCorrectBefore < 3) {
        setSuccessText(successMessages[numCorrectBefore]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      }
      setCorrect((prev) => ({ ...prev, [quizId]: true }));
      // Close the card after the overlay duration for non-final questions
      setTimeout(() => setActiveQuizId(null), 2500);
    } else {
      setFeedback("");
      const failMessages = [
        "You hear footsteps… someone is watching.",
        "The death is coming…",
        "Wrong choice. The room grows colder.",
      ];
      const index = Math.min(wrongCount, 2);
      setErrorText(failMessages[index]);
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      setWrongCount((c) => c + 1);
    }
  }

  // Winning condition: user has correctly answered all four
  useEffect(() => {
    if (!timerRunning) return;
    if (correct.q1 && correct.q2 && correct.q3 && correct.q4 && timeLeft !== null && timeLeft > 0) {
      setShowWinForm(true);
      setTimerRunning(false);
      setTimeout(() => {
        setActiveQuizId(null);
      }, 1000);
    }
  }, [correct, timeLeft, timerRunning]);

  // Determine which hotspot should be shown next (sequential 1->2->3->4)
  const nextHotspotId: "q1" | "q2" | "q3" | "q4" | null = !correct.q1
    ? "q1"
    : !correct.q2
    ? "q2"
    : !correct.q3
    ? "q3"
    : !correct.q4
    ? "q4"
    : null;

  const hotspotPositions: Record<string, { pos: [number, number, number]; size: number }> = {
    q1: { pos: [7.0, 2.0, -7.0], size: 0.6 },
    q2: { pos: [-8.0, 7.0, 7.0], size: 0.6 },
    q3: { pos: [0, 50.0, 0], size: 0.9 },
    q4: { pos: [-8, 5, -18], size: 0.9 },
  };

  async function handleSubmitNewQuestion() {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const payload = {
        question: newQuestion.trim(),
        answer: newAnswer.trim().toLowerCase(),
        hint: newHint.trim() || undefined,
      };

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save question");

      // Reset form and show success
      setNewQuestion("");
      setNewAnswer("");
      setNewHint("");
      setShowWinForm(false);
      setShowWin(true);
    } catch (err) {
      console.error("Failed to submit question:", err);
      // Still show success even if API fails
      setNewQuestion("");
      setNewAnswer("");
      setNewHint("");
      setShowWinForm(false);
      setShowWin(true);
    } finally {
      setIsSubmittingQuestion(false);
    }
  }

  function resetGame() {
    setShowFail(false);
    setShowWin(false);
    setShowWinForm(false);
    setActiveQuizId(null);
    setFeedback("");
    setCorrect({ q1: false, q2: false, q3: false, q4: false });
    setTimerRunning(false);
    setTimeLeft(null);
    setInitialTimeSeconds(null);
    setSecondsInput("");
    setShowIntro(true);
    // Reset win form
    setNewQuestion("");
    setNewAnswer("");
    setNewHint("");
    setIsSubmittingQuestion(false);
  }

  const activeQuiz = activeQuizId === "q1" ? q1 : activeQuizId === "q2" ? q2 : activeQuizId === "q3" ? q3 : activeQuizId === "q4" ? q4 : undefined;
  // q1 and q4 are always loaded from API, so they should always be in "answer" mode
  // q2 and q3 should also be loaded from API, so they should always be in "answer" mode
  // Only the win form uses "create" mode
  const mode = "answer";

  return (
    <div className="relative h-screen w-screen">
      <Canvas camera={{ fov: 75, position: [0, 1.6, 0] }}>
        <Suspense
          fallback={
            <Html center>
              <div style={{ padding: "8px 12px", background: "rgba(0,0,0,0.6)", color: "white", borderRadius: 8 }}>
                Loading 3D image…
              </div>
            </Html>
          }
        >
          <Scene />

          {nextHotspotId && (
            <Hotspot3D
              position={hotspotPositions[nextHotspotId].pos}
              size={hotspotPositions[nextHotspotId].size}
              onSelect={() => {
                setActiveQuizId(nextHotspotId);
                setFeedback("");
              }}
              onHoverChange={(isHover) => setOrbitEnabled(!isHover)}
            />
          )}

          <OrbitControls enabled={orbitEnabled} enablePan={false} enableZoom={false} rotateSpeed={0.45} />
        </Suspense>
      </Canvas>

      {showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl border bg-white/90 dark:bg-black/70 backdrop-blur p-6 space-y-5 shadow-xl">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-red-600 inline-block border-b-2 border-red-600 pb-1">
              Welcome to the Escape Room
            </h2>
            <p className="text-sm opacity-85">Look around and answer each hotspot in order. Set your timer to begin.</p>
            <div className="flex items-center gap-3 sm:flex-nowrap flex-wrap">
              <label className="text-xs uppercase tracking-wide opacity-70">Timer (seconds)</label>
              <input
                type="number"
                min={10}
                max={3600}
                value={secondsInput}
                onChange={(e) => setSecondsInput(e.target.value)}
                placeholder="300"
                className="w-36 rounded-md border bg-transparent px-3 py-2 text-sm"
              />
              <button
                onClick={() => {
                  if (handleTimerStart()) setShowIntro(false);
                }}
                className="h-[38px] rounded-md bg-red-600 text-white px-4 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/60"
              >
                Start
              </button>
            </div>
            <div className="text-[11px] opacity-60">Allowed range: 10 – 3600</div>
          </div>
        </div>
      )}

      {timeLeft !== null && (
        <div className="absolute top-4 right-4 rounded-xl border bg-white/85 dark:bg-black/50 backdrop-blur p-3 flex items-center gap-3 shadow-md">
          <div className="text-lg tabular-nums font-mono tracking-wider">
            {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTimerStart}
              className="rounded-full border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              Start
            </button>
            <button
              onClick={handleTimerPause}
              className="rounded-full border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              Pause
            </button>
          </div>
        </div>
      )}

      {activeQuizId && activeQuiz && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl">
            <QuizzCard
              mode={mode}
              quizId={activeQuiz.id}
              question={activeQuiz.question}
              hint={activeQuiz.hint}
              onClose={() => setActiveQuizId(null)}
              onSubmitAnswer={(ans) => handleSubmitAnswer(activeQuiz.id, ans)}
            />
            {/* Inline feedback removed in favor of centered overlays */}
          </div>
        </div>
      )}

      {showWinForm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl rounded-xl border bg-white/90 dark:bg-black/70 backdrop-blur p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations! You Escaped! 🎉</h2>
              <p className="text-gray-600 dark:text-gray-300">Help the next player by dropping a question for them to solve.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question *
                </label>
                <textarea
                  className="w-full h-24 rounded-lg border bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-green-500 p-3 text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="Enter a challenging question for the next player..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correct Answer *
                </label>
                <input
                  className="w-full rounded-lg border bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-green-500 p-3 text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="What is the correct answer?"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hint (Optional)
                </label>
                <input
                  className="w-full rounded-lg border bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-green-500 p-3 text-gray-800 dark:text-gray-200 text-sm"
                  placeholder="Give them a hint if they get stuck..."
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={handleSubmitNewQuestion}
                disabled={!newQuestion.trim() || !newAnswer.trim() || isSubmittingQuestion}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmittingQuestion ? "Submitting..." : "Drop Question & Finish"}
              </button>
              <button
                onClick={() => {
                  setShowWinForm(false);
                  setShowWin(true);
                }}
                className="px-6 py-3 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Skip & Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {showWin && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="rounded-xl border bg-white/90 dark:bg-black/70 backdrop-blur p-6 text-center">
            <div className="text-lg font-semibold mb-2">You&apos;ve unlocked the truth hidden within these walls.</div>
            <button
              onClick={() => {
                window.location.href = "/site/escaperoom";
              }}
              className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Back to Escape Room
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-4 rounded-2xl bg-green-600/90 text-white text-xl font-semibold shadow-2xl animate-[fadein_200ms_ease-out,fadeout_300ms_ease-in_2.5s_forwards]">
            {successText}
          </div>
        </div>
      )}

      {showError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-4 rounded-2xl bg-red-600/90 text-white text-xl font-semibold shadow-2xl animate-[fadein_200ms_ease-out,fadeout_300ms_ease-in_2.5s_forwards]">
            {errorText}
          </div>
        </div>
      )}

      {showFail && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="rounded-xl border bg-white/95 dark:bg-black/80 backdrop-blur p-8 text-center shadow-2xl">
            <div className="text-2xl font-extrabold mb-2 uppercase tracking-[0.25em] bg-gradient-to-b from-red-600 to-red-900 text-transparent bg-clip-text drop-shadow-[0_2px_6px_rgba(185,28,28,0.6)]">
              YOU ARE DEAD
            </div>
            <div className="text-sm opacity-80 mb-5">Start a new game to try again.</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetGame}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Scene() {
  const texture = useLoader(THREE.TextureLoader, "/creepy_bathroom.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
