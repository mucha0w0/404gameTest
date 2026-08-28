export type GamePhase = 'START' | 'PLAY' | 'RESULT';

export type PlaySubPhase = 'ready' | 'running';

export type GameState = {
  phase: GamePhase;
  playSubPhase: PlaySubPhase;
  startTime: number | null;
  elapsedMs: number;
  score: number;
};

export const TARGET_SECONDS = 10;

export const INITIAL_STATE: GameState = {
  phase: 'START',
  playSubPhase: 'ready',
  startTime: null,
  elapsedMs: 0,
  score: 0,
};

export function calculateScore(elapsedMs: number): number {
  const elapsedSeconds = elapsedMs / 1000;
  const diff = Math.abs(elapsedSeconds - TARGET_SECONDS);
  return Math.max(0, Math.round(1000 - diff * 100));
}

export function formatElapsed(ms: number): string {
  const seconds = ms / 1000;
  return seconds.toFixed(2);
}

export function buildResultMessage(elapsedMs: number, score: number): string {
  const elapsed = formatElapsed(elapsedMs);
  const diff = Math.abs(elapsedMs / 1000 - TARGET_SECONDS).toFixed(2);

  if (score >= 1000) {
    return `⏱ ${elapsed}秒 — パーフェクト！`;
  }

  if (score >= 900) {
    return `⏱ ${elapsed}秒 — 10秒との差 ${diff}秒。惜しい！`;
  }

  return `⏱ ${elapsed}秒 — 10秒との差 ${diff}秒。`;
}
