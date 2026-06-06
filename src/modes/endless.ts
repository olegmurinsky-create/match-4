import { GameModeStrategy, Board, Color, applyGravity, LevelProgressionResult, hasPossibleMoves, ALL_COLORS, createBall, ROWS, COLS } from '../gameLogic';

export class EndlessStrategy implements GameModeStrategy {
  fillSpaces(board: Board, colorPool: Color[]): Board {
    // Apply gravity first
    let newBoard = applyGravity(board);

    // Fill empty spaces at the top
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c] === null) {
          newBoard[r][c] = createBall(colorPool);
        }
      }
    }

    // Do not reshuffle here, so checkGameOver can catch if no moves are left.

    return newBoard;
  }

  processLevelProgression(ballsPopped: number, currentLevel: number, currentTarget: number, currentColorPool: Color[]): LevelProgressionResult {
    const newPool = [...currentColorPool];
    if (ballsPopped >= currentTarget) {
      if (newPool.length < ALL_COLORS.length) {
        newPool.push(ALL_COLORS[newPool.length]);
      }
      const nextLevel = currentLevel + 1;
      const increment = 50 * nextLevel * nextLevel + 100;
      return {
        level: nextLevel,
        targetBalls: currentTarget + increment,
        colorPool: newPool,
        shouldActivateFever: false, // Never activate fever in endless
      };
    }
    return { level: currentLevel, targetBalls: currentTarget, colorPool: newPool, shouldActivateFever: false };
  }

  checkGameOver(board: Board): boolean {
    const isFull = !board.some(row => row.some(cell => cell === null));
    return isFull && !hasPossibleMoves(board);
  }

  onFeverEnd(): 'level_clear' | 'playing' {
    return 'playing'; // In endless, fever ending just returns to normal play
  }


}