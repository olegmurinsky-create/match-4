import { GameModeStrategy, Board, Color, applyGravity, LevelProgressionResult, hasPossibleMoves } from '../gameLogic';

export class SurvivalStrategy implements GameModeStrategy {
  fillSpaces(board: Board, _colorPool: Color[]): Board {
    // Survival only applies gravity. No new balls are added.
    return applyGravity(board);
  }

  processLevelProgression(ballsPopped: number, currentLevel: number, currentTarget: number, currentColorPool: Color[]): LevelProgressionResult {
    if (ballsPopped >= currentTarget) {
      // Signal level up, but don't compute the new state here. App.tsx will do it.
      return {
        level: currentLevel, 
        targetBalls: currentTarget, 
        colorPool: currentColorPool,
        shouldLevelUp: true 
      };
    }
    return { level: currentLevel, targetBalls: currentTarget, colorPool: currentColorPool, shouldLevelUp: false };
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