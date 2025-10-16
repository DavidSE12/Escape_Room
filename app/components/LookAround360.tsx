"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Hotspot3D from "./HotSpot3D";
import QuizzCard from "./QnA";

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
	const [secondsToStart, setSecondsToStart] = useState<number>(300);
	const [timeLeft, setTimeLeft] = useState<number>(300);
	const [timerRunning, setTimerRunning] = useState<boolean>(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const [q1, setQ1] = useState<QuizData>({ id: "q1", question: "What is the capital of Australia?", answer: "canberra", hint: "It's not Sydney or Melbourne." });
	const [q2, setQ2] = useState<QuizData>({ id: "q2" });
	const [q3, setQ3] = useState<QuizData>({ id: "q3" });
	const [q4, setQ4] = useState<QuizData>({ id: "q4", question: "Write a JavaScript expression that returns the length of array arr.", answer: "arr.length", hint: "Use a property on arrays." });
	const [feedback, setFeedback] = useState<string>("");
	const [showWin, setShowWin] = useState<boolean>(false);
	const [correct, setCorrect] = useState<{ q1: boolean; q2: boolean; q3: boolean; q4: boolean }>({ q1: false, q2: false, q3: false, q4: false });

	// Load from API/local for q2/q3
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/questions", { cache: "no-store" });
				if (res.ok) {
					const items = await res.json();
					const getByKey = (k: string) => items.find((x: any) => x.quizKey === k);
					const i2 = getByKey("q2");
					const i3 = getByKey("q3");
					if (i2) setQ2({ id: "q2", question: i2.question, answer: String(i2.answer).toLowerCase(), hint: i2.hint || undefined });
					if (i3) setQ3({ id: "q3", question: i3.question, answer: String(i3.answer).toLowerCase(), hint: i3.hint || undefined });
				}
			} catch {}
			try {
				const s2 = localStorage.getItem("er3d_q2");
				const s3 = localStorage.getItem("er3d_q3");
				if (s2 && !q2.question) setQ2(JSON.parse(s2));
				if (s3 && !q3.question) setQ3(JSON.parse(s3));
			} catch {}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Timer logic
	useEffect(() => {
		if (!timerRunning) {
			if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
			return;
		}
		if (timerRef.current) return;
		timerRef.current = setInterval(() => { setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)); }, 1000);
		return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
	}, [timerRunning]);
	useEffect(() => { if (timeLeft === 0) setTimerRunning(false); }, [timeLeft]);

	function handleTimerSet() { const c = Math.max(10, Math.min(3600, Math.floor(secondsToStart))); setSecondsToStart(c); setTimeLeft(c); setTimerRunning(false); }
	function handleTimerStart() { if (timeLeft <= 0) setTimeLeft(secondsToStart); setTimerRunning(true); }
	function handleTimerPause() { setTimerRunning(false); }
	function handleTimerReset() { setTimerRunning(false); setTimeLeft(secondsToStart); }
	const { m, s } = { m: Math.floor(timeLeft / 60), s: timeLeft % 60 };

	async function handleCreate(quizId: string, data: { question: string; answer: string; hint?: string }) {
		const normalizedAnswer = data.answer.trim().toLowerCase();
		const payload = { quizKey: quizId, question: data.question.trim(), answer: normalizedAnswer, hint: data.hint };
		try {
			const res = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
			if (!res.ok) throw new Error("Failed to save");
			if (quizId === "q2") setQ2({ id: quizId, question: payload.question, answer: normalizedAnswer, hint: payload.hint });
			if (quizId === "q3") setQ3({ id: quizId, question: payload.question, answer: normalizedAnswer, hint: payload.hint });
			setFeedback("Saved question. Closing...");
			setTimeout(() => setActiveQuizId(null), 600);
		} catch {
			if (quizId === "q2") setQ2({ id: quizId, question: payload.question, answer: normalizedAnswer, hint: payload.hint });
			if (quizId === "q3") setQ3({ id: quizId, question: payload.question, answer: normalizedAnswer, hint: payload.hint });
			setFeedback("Saved locally (API unavailable). Closing...");
			setTimeout(() => setActiveQuizId(null), 600);
		}
	}

	function handleSubmitAnswer(quizId: string, userAnswer: string) {
		const normalized = userAnswer.trim().toLowerCase();
		const quiz = quizId === "q1" ? q1 : quizId === "q2" ? q2 : quizId === "q3" ? q3 : q4;
		if (!quiz.answer) { setFeedback("No answer set yet. Create the question first."); return; }
		if (normalized === quiz.answer.trim().toLowerCase()) {
			setFeedback("Correct!");
			setCorrect((prev) => ({ ...prev, [quizId]: true } as any));
			setTimeout(() => setActiveQuizId(null), 600);
		} else {
			setFeedback("Incorrect. Try again.");
		}
	}

	// Winning condition: user has correctly answered all four
	useEffect(() => {
		if (!timerRunning) return;
		if (correct.q1 && correct.q2 && correct.q3 && correct.q4 && timeLeft > 0) {
			setShowWin(true);
			setTimerRunning(false);
			setTimeout(() => { setActiveQuizId(null); }, 1000);
		}
	}, [correct, timeLeft, timerRunning]);

	const activeQuiz = activeQuizId === "q1" ? q1 : activeQuizId === "q2" ? q2 : activeQuizId === "q3" ? q3 : activeQuizId === "q4" ? q4 : undefined;
	const mode = activeQuiz && activeQuiz.question ? "answer" : "create";

	return (
		<div className="relative h-screen w-screen">
			<Canvas camera={{ fov: 75, position: [0, 1.6, 0] }}>
				<Suspense fallback={<Html center><div style={{ padding: "8px 12px", background: "rgba(0,0,0,0.6)", color: "white", borderRadius: 8 }}>Loading 3D image…</div></Html>}>
					<Scene />

					<Hotspot3D position={[7.0, 2.0, -7.0]} size={0.6} onSelect={() => { setActiveQuizId("q1"); setFeedback(""); }} onHoverChange={(isHover) => setOrbitEnabled(!isHover)} />
					<Hotspot3D position={[-8.0, 7.0, 7.0]} size={0.6} onSelect={() => { setActiveQuizId("q2"); setFeedback(""); }} onHoverChange={(isHover) => setOrbitEnabled(!isHover)} />
					<Hotspot3D position={[9.5, -12.0, 13.0]} size={0.9} onSelect={() => { setActiveQuizId("q3"); setFeedback(""); }} onHoverChange={(isHover) => setOrbitEnabled(!isHover)} />
					<Hotspot3D position={[-8, 5, -18]} size={0.9} onSelect={() => { setActiveQuizId("q4"); setFeedback(""); }} onHoverChange={(isHover) => setOrbitEnabled(!isHover)} />

					<OrbitControls enabled={orbitEnabled} enablePan={false} enableZoom={false} rotateSpeed={0.45} />
				</Suspense>
			</Canvas>

			{showIntro && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-lg rounded-xl border bg-white/90 dark:bg-black/70 backdrop-blur p-6 space-y-4">
						<h2 className="text-xl font-semibold">Welcome to the Escape Room</h2>
						<p className="text-sm opacity-80">Look around the 3D room. Click hotspots to answer questions. Set your timer below before you start.</p>
						<div className="flex items-center gap-3 flex-wrap">
							<label className="text-sm opacity-80">Timer (seconds 10 - 3600)</label>
							<input type="number" min={10} max={3600} value={secondsToStart} onChange={(e) => setSecondsToStart(Number(e.target.value))} className="w-28 rounded border p-1 bg-transparent" />
							<button onClick={handleTimerSet} className="rounded border px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10">Set</button>
							<button onClick={() => { setShowIntro(false); handleTimerStart(); }} className="rounded border px-3 py-1 hover:bg-black/5 dark:hover:bg:white/10">Start</button>
						</div>
						<button onClick={() => setShowIntro(false)} className="rounded border px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10">Close</button>
					</div>
				</div>
			)}

			<div className="absolute top-4 right-4 rounded-lg border bg-white/80 dark:bg-black/40 backdrop-blur p-3 flex items-center gap-3">
				<div className="text-lg tabular-nums font-mono">{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
				<div className="flex gap-2">
					<button onClick={handleTimerStart} className="rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">Start</button>
					<button onClick={handleTimerPause} className="rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">Pause</button>
					<button onClick={handleTimerReset} className="rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10">Reset</button>
				</div>
			</div>

			{activeQuizId && activeQuiz && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/40">
					<div className="w-full max-w-xl">
						<QuizzCard
							mode={mode as any}
							quizId={activeQuiz.id}
							question={activeQuiz.question}
							hint={activeQuiz.hint}
							onClose={() => setActiveQuizId(null)}
							onSubmitAnswer={(ans) => handleSubmitAnswer(activeQuiz.id, ans)}
							onCreate={(data) => handleCreate(activeQuiz.id, data)}
						/>
						{feedback && (<div className="mt-3 px-3 py-2 rounded border bg-white/80 text-sm text-black">{feedback}</div>)}
					</div>
				</div>
			)}

			{showWin && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/60">
					<div className="rounded-xl border bg-white/90 dark:bg-black/70 backdrop-blur p-6 text-center">
						<div className="text-lg font-semibold mb-2">Congratulation, you have successfully escaped the room!</div>
						<button onClick={() => { window.location.href = "/"; }} className="rounded border px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">Exit</button>
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
