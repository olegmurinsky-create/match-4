import { GameModeStrategy, Board, Color, applyGravity, LevelProgressionResult, hasPossibleMoves } from '../gameLogic';

export class SurvivalStrategy implements GameModeStrategy {
  fillSpaces(board: Board, _colorPool: Color[]): Board {
    // Survival only applies gravity. No new balls are added.
    return applyGravity(board);
  }

  processLevelProgression(ballsPopped: number, currentLevel: number, currentTarget: number, currentColorPool: Color[]): LevelProgressionResult {
    if (ballsPopped >= currentTarget) {
      const newLevel = currentLevel + 1;
      return {
        level: newLevel,
        targetBalls: currentTarget + 55 + newLevel * 20,
        colorPool: currentColorPool
      };
    }
    return { level: currentLevel, targetBalls: currentTarget, colorPool: currentColorPool };
  }

  checkGameOver(board: Board, ballsPopped: number, targetBalls: number, isFeverMode: boolean): boolean {
    if (!hasPossibleMoves(board)) {
      if (isFeverMode) {
        return false; // Fever handles time
      } else if (ballsPopped >= targetBalls) {
        return false; // Handled by level_clear
      }
      return true; // Game over if no moves and not level clear
    }
    return false;
  }
}