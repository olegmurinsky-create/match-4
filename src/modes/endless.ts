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
    // Endless expands color pool every 100 balls. Target balls can represent the next milestone.
    if (ballsPopped >= currentTarget) {
      const newTarget = currentTarget + 100;
      let newColorPool = [...currentColorPool];
      // Add a new color if available
      if (newColorPool.length < ALL_COLORS.length) {
        newColorPool.push(ALL_COLORS[newColorPool.length]);
      }
      return {
        level: currentLevel, // level doesn't really matter for Endless, but we can increment it
        targetBalls: newTarget,
        colorPool: newColorPool
      };
    }
    return { level: currentLevel, targetBalls: currentTarget, colorPool: currentColorPool };
  }

  checkGameOver(_board: Board, _ballsPopped: number, _targetBalls: number, _isFeverMode: boolean): boolean {
    // In endless, it should theoretically never game over unless board is completely full of balls and no valid moves/matches exist.
    // Since we auto-reshuffle in fillSpaces when stuck, game over only occurs if even reshuffling fails, which is practically impossible,
    // but we can return false for now to essentially make it endless.
    return false;
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