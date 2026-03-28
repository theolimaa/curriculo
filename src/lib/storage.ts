// Storage híbrido: tenta KV, cai para memória compartilhada via global
// FormData fica no cliente — servidor só armazena status de aprovação

const globalApproved = global as any;
if (!globalApproved._approvedSessions) globalApproved._approvedSessions = new Set<string>();

async function kvSet(key: string, value: string) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return false;
  try {
    await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    return true;
  } catch { return false; }
}

async function kvGet(key: string): Promise<string | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    });
    const data = await res.json();
    return data.result || null;
  } catch { return null; }
}

export async function approvePayment(sessionId: string) {
  // Tenta KV primeiro, fallback para memória
  const ok = await kvSet(`approved:${sessionId}`, "1");
  if (!ok) globalApproved._approvedSessions.add(sessionId);
  console.log(`✅ Sessão aprovada: ${sessionId}, KV: ${ok}`);
}

export async function isApproved(sessionId: string): Promise<boolean> {
  // Checa KV primeiro
  const kv = await kvGet(`approved:${sessionId}`);
  if (kv === "1") return true;
  // Fallback memória
  return globalApproved._approvedSessions.has(sessionId);
}

// Compat legado
export function savePayment(_id: string, _data: any) {}
export function getPayment(_id: string) { return null; }
