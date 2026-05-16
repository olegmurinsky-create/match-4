export type Color = 'red' | 'blue' | 'green' | 'yellow';
export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow'];
export const ROWS = 15;
export const COLS = 15;

export interface Ball {
  id: string;
  color: Color;
}

export type Board = (Ball | null)[][];

export function getRandomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function createBall(color?: Color): Ball {
  return {
    id: Math.random().toString(36).substring(2, 11),
    color: color || getRandomColor()
  };
}

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function fillRandom(board: Board): Board {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c] === null) {
        newBoard[r][c] = createBall();
      }
    }
  }
  return newBoard;
}

export interface MatchResult {
  hasMatch: boolean;
  matchedPositions: { r: number; c: number }[];
}

export function findMatches(board: Board): MatchResult {
  const matchedSet = new Set<string>();

  const addMatch = (r: number, c: number) => matchedSet.add(`${r},${c}`);

  // Helper to check lines
  const checkLine = (r: number, c: number, dr: number, dc: number) => {
    const ball = board[r][c];
    if (ball === null) return;
    const color = ball.color;
    
    let length = 1;
    let currR = r + dr;
    let currC = c + dc;
    
    while (currR >= 0 && currR < ROWS && currC >= 0 && currC < COLS && board[currR][currC]?.color === color) {
      length++;
      currR += dr;
      currC += dc;
    }

    if (length >= 4) {
      for (let i = 0; i < length; i++) {
        addMatch(r + i * dr, c + i * dc);
      }
    }
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== null) {
        checkLine(r, c, 0, 1); // Horizontal
        checkLine(r, c, 1, 0); // Vertical
        checkLine(r, c, 1, 1); // Diagonal Down-Right
        checkLine(r, c, 1, -1); // Diagonal Down-Left
      }
    }
  }

  const matchedPositions = Array.from(matchedSet).map(pos => {
    const [r, c] = pos.split(',').map(Number);
    return { r, c };
  });

  return {
    hasMatch: matchedPositions.length > 0,
    matchedPositions,
  };
}

export function removeMatches(board: Board, matchedPositions: { r: number; c: number }[]): Board {
  const newBoard = board.map(row => [...row]);
  for (const { r, c } of matchedPositions) {
    newBoard[r][c] = null;
  }
  return newBoard;
}

export function applyGravityAndRefill(board: Board): Board {
  const newBoard = createEmptyBoard();

  for (let c = 0; c < COLS; c++) {
    let writeR = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] !== null) {
        newBoard[writeR][c] = board[r][c];
        writeR--;
      }
    }
    // Refill the top with new random colors
    for (let r = writeR; r >= 0; r--) {
      newBoard[r][c] = createBall();
    }
  }

  return newBoard;
}

export function createInitialBoard(): Board {
  let board = createEmptyBoard();
  board = fillRandom(board);
  
  // Resolve any initial matches
  let matchResult = findMatches(board);
  while (matchResult.hasMatch) {
    board = removeMatches(board, matchResult.matchedPositions);
    board = applyGravityAndRefill(board);
    matchResult = findMatches(board);
  }
  
  return board;
}
