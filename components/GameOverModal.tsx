type GameOverModalProps = {
  score: number;
  scoreLabel?: string;
  message?: string;
  onRetry: () => void;
  retryLabel?: string;
};

export function GameOverModal({
  score,
  scoreLabel = 'スコア',
  message,
  onRetry,
  retryLabel = 'もう一度遊ぶ',
}: GameOverModalProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-70 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg">
        <p className="text-sm font-semibold text-gray-900">結果</p>
        {message ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{message}</p>
        ) : null}
        <p className="mt-5 text-xs text-gray-400">{scoreLabel}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-blue-600">
          {score}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:scale-[0.98] touch-manipulation select-none"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}
