import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const items = await prisma.question.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { quizKey, question, answer, hint } = body || {};
  if (!quizKey || !question || !answer) {
    return NextResponse.json({ error: "quizKey, question, answer required" }, { status: 400 });
  }
  const created = await prisma.question.create({ data: { quizKey, question, answer, hint } });
  return NextResponse.json(created, { status: 201 });
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


