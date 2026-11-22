import { apiRequest } from "@/src/api/client";

export interface QueuedAnswer {
  sessionId: string;
  questionId: string;
  selectedLabel: string | null;
  isFlagged: boolean;
  updatedAt: number;
}

const queueKey = (sessionId: string) => `scholarify_answer_queue_${sessionId}`;

export function loadQueuedAnswers(sessionId: string): Record<string, QueuedAnswer> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(queueKey(sessionId));
    return raw ? (JSON.parse(raw) as Record<string, QueuedAnswer>) : {};
  } catch {
    return {};
  }
}

export function saveQueuedAnswer(item: QueuedAnswer): void {
  if (typeof window === "undefined") return;
  const current = loadQueuedAnswers(item.sessionId);
  current[item.questionId] = item;
  localStorage.setItem(queueKey(item.sessionId), JSON.stringify(current));
}

export function removeQueuedAnswer(sessionId: string, questionId: string): void {
  if (typeof window === "undefined") return;
  const current = loadQueuedAnswers(sessionId);
  delete current[questionId];
  localStorage.setItem(queueKey(sessionId), JSON.stringify(current));
}

export function clearAnswerQueue(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(queueKey(sessionId));
}

export async function flushAnswerQueue(sessionId: string): Promise<{ remaining: number }> {
  const pending = Object.values(loadQueuedAnswers(sessionId));
  let remaining = pending.length;

  for (const item of pending) {
    try {
      await apiRequest(`/sessions/${item.sessionId}/answers/${item.questionId}`, {
        method: "PUT",
        body: JSON.stringify({
          selected_label: item.selectedLabel,
          is_flagged: item.isFlagged,
        }),
      });
      removeQueuedAnswer(item.sessionId, item.questionId);
      remaining--;
    } catch {
      // Tetap simpan di queue untuk dicoba lagi saat koneksi pulih
    }
  }

  return { remaining };
}
