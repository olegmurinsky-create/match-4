import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  fillRandom,
  findMatches,
  removeMatches,
  applyGravityAndRefill,
  createBall,
  ROWS,
  COLS
} from './gameLogic';

describe('Game Logic', () => {
  it('creates an empty board of correct dimensions', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(ROWS);
    expect(board[0].length).toBe(COLS);
    board.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBeNull();
      });
    });
  });

  it('fills empty board with random colors', () => {
    const emptyBoard = createEmptyBoard();
    const filledBoard = fillRandom(emptyBoard);
    filledBoard.forEach(row => {
      row.forEach(cell => {
        expect(cell).not.toBeNull();
        expect(['red', 'blue', 'green', 'yellow']).toContain(cell!.color);
      });
    });
  });

  describe('findMatches', () => {
    it('finds no matches on an empty board', () => {
      const board = createEmptyBoard();
      const result = findMatches(board);
      expect(result.hasMatch).toBe(false);
      expect(result.matchedPositions.length).toBe(0);
    });

    it('ignores lines of less than 4', () => {
      const board = createEmptyBoard();
      // 3 horizontal
      board[0][0] = createBall('red');
      board[0][1] = createBall('red');
      board[0][2] = createBall('red');
      
      const result = findMatches(board);
      expect(result.hasMatch).toBe(false);
    });

    it('finds horizontal matches of 4 or more', () => {
      const board = createEmptyBoard();
      for (let i = 0; i < 4; i++) {
        board[2][i] = createBall('blue');
      }
      
      const result = findMatches(board);
      expect(result.hasMatch).toBe(true);
      expect(result.matchedPositions.length).toBe(4);
    });

    it('finds vertical matches of 4 or more', () => {
      const board = createEmptyBoard();
      for (let i = 0; i < 5; i++) {
        board[i][4] = createBall('green');
      }
      
      const result = findMatches(board);
      expect(result.hasMatch).toBe(true);
      expect(result.matchedPositions.length).toBe(5);
    });

    it('finds diagonal matches of 4 or more (down-right)', () => {
      const board = createEmptyBoard();
      for (let i = 0; i < 4; i++) {
        board[i][i] = createBall('yellow');
      }
      
      const result = findMatches(board);
      expect(result.hasMatch).toBe(true);
      expect(result.matchedPositions.length).toBe(4);
    });

    it('finds diagonal matches of 4 or more (down-left)', () => {
      const board = createEmptyBoard();
      for (let i = 0; i < 4; i++) {
        board[i][COLS - 1 - i] = createBall('red');
      }
      
      const result = findMatches(board);
      expect(result.hasMatch).toBe(true);
      expect(result.matchedPositions.length).toBe(4);
    });
  });

  describe('removeMatches', () => {
    it('removes matched positions from board', () => {
      const board = createEmptyBoard();
      board[0][0] = createBall('red');
      board[0][1] = createBall('blue');
      
      const positions = [{ r: 0, c: 0 }];
      const newBoard = removeMatches(board, positions);
      
      expect(newBoard[0][0]).toBeNull();
      expect(newBoard[0][1]?.color).toBe('blue'); // unaffected
    });
  });

  describe('applyGravityAndRefill', () => {
    it('applies gravity and refills top', () => {
      const board = createEmptyBoard();
      // Leave bottom cell null, put 'red' above it.
      board[ROWS - 2][0] = createBall('red');
      board[ROWS - 3][0] = createBall('blue');
      
      const newBoard = applyGravityAndRefill(board);
      
      // They should fall down
      expect(newBoard[ROWS - 1][0]?.color).toBe('red');
      expect(newBoard[ROWS - 2][0]?.color).toBe('blue');
      
      // Top should be refilled
      for (let r = 0; r < ROWS - 2; r++) {
        expect(newBoard[r][0]).not.toBeNull();
        expect(['red', 'blue', 'green', 'yellow']).toContain(newBoard[r][0]!.color);
      }
    });
  });
});
