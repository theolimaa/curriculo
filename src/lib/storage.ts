// Storage usando Vercel KV (Redis) para persistência entre instâncias serverless

interface PendingPayment {
  sessionId: string;
  formData: any;
  status: "pending" | "approved";
  createdAt: string;
}

// Helper para chamar KV REST API
async function kvSet(key: string, value: any) {
  const url = `${process.env.KV_REST_API_URL}/set/${key}`;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    body: JSON.stringify(value),
  });
}

async function kvGet(key: string): Promise<any> {
  const url = `${process.env.KV_REST_API_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

export async function savePayment(sessionId: string, formData: any) {
  const payment: PendingPayment = {
    sessionId,
    formData,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await kvSet(`pay:${sessionId}`, JSON.stringify(payment));
}

export async function getPayment(sessionId: string): Promise<PendingPayment | null> {
  return await kvGet(`pay:${sessionId}`);
}

export async function approvePayment(sessionId: string) {
  const payment = await kvGet(`pay:${sessionId}`);
  if (payment) {
    payment.status = "approved";
    await kvSet(`pay:${sessionId}`, JSON.stringify(payment));
  }
}

export async function isApproved(sessionId: string): Promise<boolean> {
  const payment = await kvGet(`pay:${sessionId}`);
  return payment?.status === "approved";
}
