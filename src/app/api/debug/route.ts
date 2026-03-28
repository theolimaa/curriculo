import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  let upstashStatus = "não configurado";
  let upstashValue = null;
  if (upstashUrl && upstashToken) {
    try {
      const setRes = await fetch(`${upstashUrl}/set/debug:test/hello`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
      });
      const setData = await setRes.json();
      if (email) {
        const getRes = await fetch(`${upstashUrl}/get/approved:email:${email.toLowerCase()}`, {
          headers: { Authorization: `Bearer ${upstashToken}` },
        });
        const getData = await getRes.json();
        upstashValue = getData.result;
      }
      upstashStatus = setData.result === "OK" ? "funcionando" : `erro: ${JSON.stringify(setData)}`;
    } catch (e: any) {
      upstashStatus = `exception: ${e.message}`;
    }
  }
  return NextResponse.json({
    upstash_url: upstashUrl ? "configurado" : "NAO_ENCONTRADO",
    upstash_token: upstashToken ? "configurado" : "NAO_ENCONTRADO",
    upstash_connection: upstashStatus,
    email_checked: email || "nenhum",
    email_approved: upstashValue === "1",
    raw_value: upstashValue,
  });
}

export async function POST(req: NextRequest) {
  const { email, secret } = await req.json();
  if (secret !== "curriculo2026") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!upstashUrl || !upstashToken) return NextResponse.json({ error: "Upstash não configurado" }, { status: 500 });
  const key = `approved:email:${email.toLowerCase().trim()}`;
  const res = await fetch(`${upstashUrl}/set/${key}/1/ex/7200`, {
    headers: { Authorization: `Bearer ${upstashToken}` },
  });
  const data = await res.json();
  return NextResponse.json({ ok: true, approved: email, redis: data });
}
