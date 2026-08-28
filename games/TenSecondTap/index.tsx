import { useCallback, useState } from 'react';
import { GameHeader } from '../../components/GameHeader';
import { GameOverModal } from '../../components/GameOverModal';
import {
  buildResultMessage,
  calculateScore,
  INITIAL_STATE,
  type GameState,
} from './logic';

export default function TenSecondTap() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const handleStart = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      phase: 'PLAY',
    });
  }, []);

  const handleTapButton = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'PLAY') {
        return prev;
      }

      if (prev.playSubPhase === 'ready') {
        return {
          ...prev,
          playSubPhase: 'running',
          startTime: performance.now(),
        };
      }

      const elapsedMs = prev.startTime
        ? performance.now() - prev.startTime
        : 0;
      const score = calculateScore(elapsedMs);

      return {
        ...prev,
        phase: 'RESULT',
        playSubPhase: 'ready',
        startTime: null,
        elapsedMs,
        score,
      };
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const resultMessage =
    state.phase === 'RESULT'
      ? buildResultMessage(state.elapsedMs, state.score)
      : '';

  const playHint =
    state.playSubPhase === 'ready'
      ? 'ボタンを押してタイマーを開始'
      : '10秒ぴったりを狙ってもう一度押す';

  return (
    <div className="relative mx-auto flex h-105 w-full max-w-sm select-none flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm touch-manipulation">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <GameHeader title="10秒チャレンジ" subtitle="お前の体内時計はいかほどか" />

        {state.phase === 'START' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
              10
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-gray-600">
              <p>ボタンを押して10秒ぴったりを狙おう</p>
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
            <p className="min-h-10 px-2 text-center text-sm text-gray-600">
              {playHint}
            </p>
            <button
              type="button"
              onClick={handleTapButton}
              className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 active:scale-[0.98] touch-manipulation select-none"
              aria-label={
                state.playSubPhase === 'ready'
                  ? 'タイマーを開始'
                  : 'タイマーを止める'
              }
            >
              {state.playSubPhase === 'ready' ? 'スタート' : 'ストップ'}
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
