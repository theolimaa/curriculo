async function redis(cmd: string, ...args: string[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.REDIS_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/${cmd}/${args.join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.result;
}

export async function approveByEmail(email: string) {
  const key = `approved:email:${email.toLowerCase().trim()}`;
  await redis("set", key, "1", "ex", "7200");
  console.log(`✅ Aprovado por email: ${email}`);
}

export async function isApprovedByEmail(email: string): Promise<boolean> {
  const key = `approved:email:${email.toLowerCase().trim()}`;
  const result = await redis("get", key);
  return result === "1";
}

export async function approvePayment(sessionId: string) {}
export async function isApproved(sessionId: string): Promise<boolean> { return false; }
export async function savePayment(_id: string, _data: any) {}
export async function getPayment(_id: string) { return null; }
