/**
 * ゲームコンポーネント テンプレート
 *
 * 使い方:
 * 1. この `template` フォルダを複製し、`games/YourGameName/` にリネーム
 * 2. コンポーネント名・タイトル・ゲームロジックを書き換え
 * 3. `src/App.tsx` で import して表示（提出時はフォルダのみ送っても OK）
 *
 * 仕様: readme.md を参照（360×480px 枠、START → PLAY → RESULT、タッチ操作のみ）
 */

import { useCallback, useState } from 'react';
import { GameHeader } from '../../components/GameHeader';
import { GameOverModal } from '../../components/GameOverModal';
import {
  buildResultMessage,
  calculateScore,
  GOAL_TAPS,
  INITIAL_STATE,
  type GameState,
} from './logic';

export default function GameTemplate() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const handleStart = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      phase: 'PLAY',
    });
  }, []);

  const handleTap = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'PLAY') {
        return prev;
      }

      const tapCount = prev.tapCount + 1;

      if (tapCount >= GOAL_TAPS) {
        const score = calculateScore(tapCount);
        return {
          ...prev,
          phase: 'RESULT',
          tapCount,
          score,
        };
      }

      return {
        ...prev,
        tapCount,
      };
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const resultMessage =
    state.phase === 'RESULT'
      ? buildResultMessage(state.tapCount, state.score)
      : '';

  return (
    <div className="relative mx-auto flex h-105 w-full max-w-sm select-none flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm touch-manipulation">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <GameHeader
          title="ゲームタイトル"
          subtitle="ここにサブタイトルやキャッチコピー"
        />

        {state.phase === 'START' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              🎮
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-gray-600">
              <p>{GOAL_TAPS} 回タップでクリア</p>
              <p className="text-xs text-gray-400">
                {/* TODO: ルール説明を書き換え */}
                ボタンをタップしてプレイ開始
              </p>
            </div>
            <button
              type="button"
              onClick={handleStart}
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:scale-[0.98] touch-manipulation select-none"
            >
              スタート
            </button>
          </div>
        )}

        {state.phase === 'PLAY' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <p className="text-sm tabular-nums text-gray-600">
              {state.tapCount} / {GOAL_TAPS}
            </p>
            <button
              type="button"
              onClick={handleTap}
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 active:scale-[0.98] touch-manipulation select-none"
              aria-label="タップ"
            >
              タップ
            </button>
            <p className="text-xs text-gray-400">タップで操作</p>
          </div>
        )}

        {state.phase === 'RESULT' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-gray-500">プレイお疲れさまでした</p>
            <p className="text-xs text-gray-400">結果を確認してください</p>
          </div>
        )}
      </div>

      {state.phase === 'RESULT' && (
        <GameOverModal
          score={state.score}
          message={resultMessage}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
