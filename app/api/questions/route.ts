import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest){
  try {
    // 1️⃣ Lấy toàn bộ danh sách ID từ database
    const idRows = await prisma.question.findMany({
      select: { id: true },
    });

    if (idRows.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 });
    }

    // 2️⃣ Xáo trộn danh sách ID ngẫu nhiên (Fisher–Yates Shuffle)
    const ids = idRows.map(r => r.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    // 3️⃣ Chọn 4 ID đầu tiên (hoặc ít hơn nếu không đủ)
    const pickedIds = ids.slice(0, Math.min(4, ids.length));

    // 4️⃣ Lấy dữ liệu các câu hỏi tương ứng
    const questions = await prisma.question.findMany({
      where: { id: { in: pickedIds } },
    });

    // 5️⃣ Trả về kết quả JSON
    const res = NextResponse.json(questions);
    res.headers.set("Cache-Control", "no-store"); // tránh cache kết quả random
    return res;
  } catch (err) {
    console.error("GET /api/questions (random 4) error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    // (optional) basic safeguard
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    const body = await req.json().catch(() => null);
    const rawQuestion = body?.question;
    const rawAnswer = body?.answer;
    const rawHint = body?.hint;

    // normalize + validate
    const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";
    const answer = typeof rawAnswer === "string" ? rawAnswer.trim() : "";
    const hint =
      rawHint === undefined || rawHint === null
        ? null
        : String(rawHint).trim() || null;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Both 'question' and 'answer' are required (non-empty strings)." },
        { status: 400 }
      );
    }

    // create record (id autoincrements; createdAt/updatedAt via Prisma defaults)
    const created = await prisma.question.create({
      data: { question, answer, hint },
    });

    // Location header is nice REST hygiene
    const res = NextResponse.json(created, { status: 201 });
    res.headers.set("Location", `/api/questions/${created.id}`);
    return res;
  } catch (err) {
    console.error("POST /api/questions error:", err);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, question, answer, hint } = body || {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = await prisma.question.update({ where: { id: Number(id) }, data: { question, answer, hint } });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.question.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}


