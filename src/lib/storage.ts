// Armazena pagamentos pendentes em memória
// Em produção, substitua por banco de dados (Redis, Supabase, etc.)

interface PendingPayment {
  paymentId: string;
  formData: any;
  status: "pending" | "approved";
  createdAt: Date;
}

const payments = new Map<string, PendingPayment>();

export function savePayment(paymentId: string, formData: any) {
  payments.set(paymentId, {
    paymentId,
    formData,
    status: "pending",
    createdAt: new Date(),
  });
}

export function getPayment(paymentId: string): PendingPayment | undefined {
  return payments.get(paymentId);
}

export function approvePayment(paymentId: string) {
  const payment = payments.get(paymentId);
  if (payment) {
    payment.status = "approved";
    payments.set(paymentId, payment);
  }
}

export function isApproved(paymentId: string): boolean {
  return payments.get(paymentId)?.status === "approved";
}
