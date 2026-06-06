import { GameModeStrategy, Board, Color, applyGravity, LevelProgressionResult, hasPossibleMoves, findMatches, ALL_COLORS, createBall, ROWS, COLS } from '../gameLogic';

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

    // Guarantee possible moves (reshuffle if stuck after filling, and completely stabilized)
    if (!findMatches(newBoard).hasMatch && !hasPossibleMoves(newBoard)) {
      // Reshuffle board
      newBoard = this.reshuffle(newBoard, colorPool);
    }

    return newBoard;
  }

  processLevelProgression(ballsPopped: number, currentLevel: number, currentTarget: number, currentColorPool: Color[]): LevelProgressionResult {
    const newPool = [...currentColorPool];
    if (ballsPopped >= currentTarget) {
      if (newPool.length < ALL_COLORS.length) {
        newPool.push(ALL_COLORS[newPool.length]);
      }
      return {
        level: currentLevel,
        targetBalls: currentTarget + 100,
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

  private reshuffle(board: Board, colorPool: Color[]): Board {
    // Simple reshuffle strategy: keep collecting all non-null balls, shuffle their colors, and place them back.
    // But since endless fills the board completely, we can just replace all balls ensuring at least one move.
    let newBoard = board.map(row => [...row]);
    let attempts = 0;
    do {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c] !== null) {
            newBoard[r][c] = createBall(colorPool);
          }
        }
      }
      attempts++;
      if (attempts > 100) break; // Fallback
    } while (findMatches(newBoard).hasMatch || !hasPossibleMoves(newBoard));
    
    return newBoard;
  }
}