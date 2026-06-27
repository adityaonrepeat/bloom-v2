import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Keeps the serverless function + DB connection warm so the first real user
// after an idle period doesn't hit a slow cold start (which was bouncing
// people to /login). Pinged every few minutes by an external scheduler
// (cron-job.org). Just a trivial SELECT 1 — safe to leave public.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, warmedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ ok: false, error: "db" }, { status: 500 });
  }
}
