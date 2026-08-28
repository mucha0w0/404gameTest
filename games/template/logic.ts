/**
 * ゲームロジック（UI から分離）
 *
 * このファイルを編集して、スコア計算・状態の型・定数を定義してください。
 * 複雑なゲームでも、判定や計算はここに集約するとテストしやすくなります。
 */

export type GamePhase = 'START' | 'PLAY' | 'RESULT';

export type GameState = {
  phase: GamePhase;
  tapCount: number;
  score: number;
};

/** ゴールとなるタップ回数 — ゲームに合わせて変更 */
export const GOAL_TAPS = 5;

export const INITIAL_STATE: GameState = {
  phase: 'START',
  tapCount: 0,
  score: 0,
};

/** スコア計算 — ゲームルールに合わせて書き換え */
export function calculateScore(tapCount: number): number {
  return tapCount * 100;
}

/** 結果画面に表示するメッセージ — 任意でカスタマイズ */
export function buildResultMessage(tapCount: number, score: number): string {
  if (tapCount >= GOAL_TAPS) {
    return `🎯 ${tapCount} 回タップ — クリア！`;
  }
  return `🎯 ${tapCount} 回タップ — スコア ${score}`;
}
