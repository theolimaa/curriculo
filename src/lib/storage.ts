// Upstash Redis via REST API — funciona em serverless sem SDK
async function redis(cmd: string, ...args: string[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.error("UPSTASH não configurado");
    return null;
  }
  const res = await fetch(`${url}/${cmd}/${args.join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.result;
}

export async function approvePayment(sessionId: string) {
  // Salva aprovação por 2 horas
  await redis("set", `approved:${sessionId}`, "1", "ex", "7200");
  console.log(`✅ Aprovado: ${sessionId}`);
}

export async function isApproved(sessionId: string): Promise<boolean> {
  const result = await redis("get", `approved:${sessionId}`);
  return result === "1";
}

// Legado — não usados mais
export async function savePayment(_id: string, _data: any) {}
export async function getPayment(_id: string) { return null; }
