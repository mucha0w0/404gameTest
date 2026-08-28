import { useCallback, useState } from 'react';
import { GameHeader } from '../../components/GameHeader';
import { GameOverModal } from '../../components/GameOverModal';
import {
  applyMove,
  buildResultMessage,
  getCpuMove,
  INITIAL_STATE,
  type Cell,
  type GameState,
} from './logic';

function CellButton({
  value,
  index,
  isWinning,
  disabled,
  onSelect,
}: {
  value: Cell;
  index: number;
  isWinning: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
}) {
  const label =
    value === 'X' ? '✕' : value === 'O' ? '○' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(index)}
      aria-label={
        value ? `マス ${index + 1}: ${value}` : `マス ${index + 1}: 空`
      }
      className={[
        'flex aspect-square items-center justify-center rounded-lg border-2 text-3xl font-bold transition-all duration-200 touch-manipulation select-none',
        isWinning
          ? 'border-green-400 bg-green-50 text-green-700'
          : value === 'X'
            ? 'border-blue-200 bg-blue-50 text-blue-600'
            : value === 'O'
              ? 'border-rose-200 bg-rose-50 text-rose-500'
              : 'border-gray-200 bg-gray-50 text-gray-300 hover:border-blue-200 hover:bg-blue-50/50 active:scale-[0.97]',
        disabled && !value ? 'cursor-not-allowed opacity-60' : '',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

export default function TicTacToe() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const handleStart = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      phase: 'PLAY',
    });
  }, []);

  const handleCellSelect = useCallback((index: number) => {
    setState((prev) => {
      if (prev.phase !== 'PLAY' || prev.currentPlayer !== 'X') {
        return prev;
      }

      const afterPlayer = applyMove(prev, index, 'X');
      if (afterPlayer.phase === 'RESULT') {
        return afterPlayer;
      }

      const cpuIndex = getCpuMove(afterPlayer.board, 'O');
      if (cpuIndex < 0) {
        return afterPlayer;
      }

      return applyMove(afterPlayer, cpuIndex, 'O');
    });
  }, []);

  const handleRetry = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const resultMessage =
    state.phase === 'RESULT'
      ? buildResultMessage(state.outcome, state.score)
      : '';

  const turnHint =
    state.phase === 'PLAY'
      ? state.currentPlayer === 'X'
        ? 'あなたの番（✕）'
        : 'コンピュータの番…'
      : '';

  const winningSet = new Set(state.winningLine ?? []);

  return (
    <div className="relative mx-auto flex h-105 w-full max-w-sm select-none flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm touch-manipulation">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <GameHeader
          title="三目並べ"
          subtitle="コンピュータに勝とう"
        />

        {state.phase === 'START' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              ⭕
            </div>
            <div className="space-y-2 text-sm leading-relaxed text-gray-600">
              <p>3×3のマスで三つ並べたら勝ち</p>
              <p className="text-xs text-gray-400">
                あなたは ✕、コンピュータは ○ です
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
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p className="min-h-5 text-sm font-medium text-gray-600">
              {turnHint}
            </p>
            <div
              className="grid w-full max-w-55 grid-cols-3 gap-2"
              role="grid"
              aria-label="三目並べの盤面"
            >
              {state.board.map((cell, index) => (
                <CellButton
                  key={index}
                  value={cell}
                  index={index}
                  isWinning={winningSet.has(index)}
                  disabled={
                    cell !== null || state.currentPlayer !== 'X'
                  }
                  onSelect={handleCellSelect}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">マスをタップして置く</p>
          </div>
        )}

        {state.phase === 'RESULT' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div
              className="grid w-full max-w-55 grid-cols-3 gap-2 opacity-90"
              aria-hidden
            >
              {state.board.map((cell, index) => (
                <CellButton
                  key={index}
                  value={cell}
                  index={index}
                  isWinning={winningSet.has(index)}
                  disabled
                  onSelect={() => {}}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">プレイお疲れさまでした</p>
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
