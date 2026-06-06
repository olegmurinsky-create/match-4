import { GameModeStrategy, Board, Color, applyGravity, LevelProgressionResult, hasPossibleMoves } from '../gameLogic';

export class SurvivalStrategy implements GameModeStrategy {
  fillSpaces(board: Board, _colorPool: Color[]): Board {
    // Survival only applies gravity. No new balls are added.
    return applyGravity(board);
  }

  processLevelProgression(ballsPopped: number, currentLevel: number, currentTarget: number, currentColorPool: Color[]): LevelProgressionResult {
    const shouldLevelUp = ballsPopped >= currentTarget;
    return {
      level: currentLevel,
      targetBalls: currentTarget,
      colorPool: currentColorPool,
      shouldLevelUp: shouldLevelUp,
      shouldActivateFever: shouldLevelUp, // In survival, level up also triggers fever
    };
  }

  checkGameOver(board: Board, ballsPopped: number, targetBalls: number, isFeverMode: boolean): boolean {
    if (!hasPossibleMoves(board)) {
      if (isFeverMode) {
        return false; // Let timer run out
      } else if (ballsPopped >= targetBalls) {
        return false; // This will be handled by level_clear state
      }
      return true;
    }
    return false;
  }

  onFeverEnd(): 'level_clear' | 'playing' {
    return 'level_clear';
  }
}