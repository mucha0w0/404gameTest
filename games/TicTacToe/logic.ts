export type GamePhase = 'START' | 'PLAY' | 'RESULT';

export type Player = 'X' | 'O';

export type Cell = Player | null;

export type GameOutcome = 'win' | 'lose' | 'draw' | null;

export type GameState = {
  phase: GamePhase;
  board: Cell[];
  currentPlayer: Player;
  outcome: GameOutcome;
  winningLine: number[] | null;
  moves: number;
  score: number;
};

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const INITIAL_STATE: GameState = {
  phase: 'START',
  board: Array<Cell>(9).fill(null),
  currentPlayer: 'X',
  outcome: null,
  winningLine: null,
  moves: 0,
  score: 0,
};

export function getWinner(board: Cell[]): {
  winner: Player | 'draw' | null;
  line: number[] | null;
} {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [...line] };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

export function getAvailableMoves(board: Cell[]): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

function minimax(
  board: Cell[],
  depth: number,
  isMaximizing: boolean,
  ai: Player,
  human: Player,
): number {
  const { winner } = getWinner(board);

  if (winner !== null) {
    if (winner === 'draw') {
      return 0;
    }
    return winner === ai ? 10 - depth : depth - 10;
  }

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    return Math.max(
      ...moves.map((index) => {
        const next = [...board];
        next[index] = ai;
        return minimax(next, depth + 1, false, ai, human);
      }),
    );
  }

  return Math.min(
    ...moves.map((index) => {
      const next = [...board];
      next[index] = human;
      return minimax(next, depth + 1, true, ai, human);
    }),
  );
}

export function getCpuMove(board: Cell[], cpu: Player = 'O'): number {
  const human: Player = cpu === 'O' ? 'X' : 'O';
  const moves = getAvailableMoves(board);

  if (moves.length === 0) {
    return -1;
  }

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const index of moves) {
    const next = [...board];
    next[index] = cpu;
    const score = minimax(next, 0, false, cpu, human);

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

export function applyMove(
  state: GameState,
  index: number,
  player: Player,
): GameState {
  if (state.phase !== 'PLAY' || state.board[index] !== null) {
    return state;
  }

  const board = [...state.board];
  board[index] = player;
  const moves = state.moves + 1;
  const { winner, line } = getWinner(board);

  if (winner === 'X') {
    return {
      ...state,
      board,
      moves,
      phase: 'RESULT',
      outcome: 'win',
      winningLine: line,
      score: calculateScore('win', moves),
    };
  }

  if (winner === 'O') {
    return {
      ...state,
      board,
      moves,
      phase: 'RESULT',
      outcome: 'lose',
      winningLine: line,
      score: calculateScore('lose', moves),
    };
  }

  if (winner === 'draw') {
    return {
      ...state,
      board,
      moves,
      phase: 'RESULT',
      outcome: 'draw',
      winningLine: null,
      score: calculateScore('draw', moves),
    };
  }

  return {
    ...state,
    board,
    moves,
    currentPlayer: player === 'X' ? 'O' : 'X',
  };
}

export function calculateScore(outcome: GameOutcome, moves: number): number {
  if (outcome === 'win') {
    return Math.max(500, 1000 - (moves - 5) * 100);
  }
  if (outcome === 'draw') {
    return 400;
  }
  return 100;
}

export function buildResultMessage(outcome: GameOutcome, score: number): string {
  if (outcome === 'win') {
    return `⭕ あなたの勝ち！ — スコア ${score}`;
  }
  if (outcome === 'lose') {
    return `✕ コンピュータの勝ち — スコア ${score}`;
  }
  if (outcome === 'draw') {
    return `🤝 引き分け — スコア ${score}`;
  }
  return `スコア ${score}`;
}
