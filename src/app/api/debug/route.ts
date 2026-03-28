import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  let status = "não configurado";
  let upstashValue = null;
  if (url && token) {
    try {
      const setRes = await fetch(`${url}/set/debug:test/hello`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const setData = await setRes.json();
      if (email) {
        const getRes = await fetch(`${url}/get/approved:email:${email.toLowerCase()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const getData = await getRes.json();
        upstashValue = getData.result;
      }
      status = setData.result === "OK" ? "✅ funcionando" : `erro: ${JSON.stringify(setData)}`;
    } catch (e: any) { status = `exception: ${e.message}`; }
  }
  return NextResponse.json({
    url_found: url ? "✅ sim" : "❌ não",
    token_found: token ? "✅ sim" : "❌ não",
    connection: status,
    email_approved: upstashValue === "1",
    raw_value: upstashValue,
  });
}

export async function POST(req: NextRequest) {
  const { email, secret } = await req.json();
  if (secret !== "curriculo2026") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return NextResponse.json({ error: "Redis não configurado" }, { status: 500 });
  const key = `approved:email:${email.toLowerCase().trim()}`;
  const res = await fetch(`${url}/set/${key}/1/ex/7200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return NextResponse.json({ ok: true, approved: email, redis: data });
}
