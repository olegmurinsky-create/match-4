import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Board, 
  createInitialBoard, 
  findMatches, 
  removeMatches, 
  applyGravityAndRefill,
  ROWS,
  COLS
} from './gameLogic';
import './App.css';

interface Position {
  r: number;
  c: number;
}

function App() {
  const [board, setBoard] = useState<Board>(() => createEmptyInitial());
  const [selected, setSelected] = useState<Position | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  // Initialize board on mount safely
  useEffect(() => {
    setBoard(createInitialBoard());
    setIsProcessing(false);
  }, []);

  const processCascades = useCallback(async (currentBoard: Board, currentScore: number) => {
    let b = currentBoard;
    let s = currentScore;
    let matchResult = findMatches(b);
    
    while (matchResult.hasMatch) {
      const matchCount = matchResult.matchedPositions.length;
      s += matchCount * 10;
      setScore(s);
      
      // Remove matches, triggering exit animation
      b = removeMatches(b, matchResult.matchedPositions);
      setBoard(b);
      
      // Wait for disappearing animation
      await new Promise(res => setTimeout(res, 200));
      
      // Apply gravity and refill, triggering fall animation
      b = applyGravityAndRefill(b);
      setBoard(b);
      
      // Wait for falling animation to settle
      await new Promise(res => setTimeout(res, 300));
      
      matchResult = findMatches(b);
    }
    
    setIsProcessing(false);
  }, []);

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing) return;

    if (!selected) {
      if (board[r][c]) {
        setSelected({ r, c });
      }
      return;
    }

    if (selected.r === r && selected.c === c) {
      // Deselect
      setSelected(null);
      return;
    }

    // Check if adjacent
    const isAdjacent = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;

    if (!isAdjacent) {
      // Select the new one instead
      if (board[r][c]) {
        setSelected({ r, c });
      }
      return;
    }

    // Attempt swap
    setIsProcessing(true);
    setSelected(null);

    const tempBoard = board.map(row => [...row]);
    const ball1 = tempBoard[selected.r][selected.c];
    const ball2 = tempBoard[r][c];

    tempBoard[selected.r][selected.c] = ball2;
    tempBoard[r][c] = ball1;

    // Optimistically update board to trigger swap layout animation
    setBoard(tempBoard);
    
    // Wait for the swap animation to finish
    await new Promise(res => setTimeout(res, 300));

    const matchResult = findMatches(tempBoard);

    if (matchResult.hasMatch) {
      // Valid swap!
      processCascades(tempBoard, score);
    } else {
      // Invalid swap, revert
      const revertBoard = tempBoard.map(row => [...row]);
      revertBoard[selected.r][selected.c] = ball1;
      revertBoard[r][c] = ball2;
      setBoard(revertBoard);
      
      // Wait for revert animation
      await new Promise(res => setTimeout(res, 300));
      setIsProcessing(false);
    }
  };

  return (
    <div className="game-container">
      <div className="header">
        <h1>Match-4</h1>
        <div className="score-board">Score: {score}</div>
        <button className="reset-button" onClick={() => {
          setIsProcessing(true);
          setScore(0);
          setBoard(createInitialBoard());
          setIsProcessing(false);
        }}>Restart</button>
      </div>

      <div className="board">
        {board.map((row, r) => (
          row.map((ball, c) => (
            <div 
              key={`${r}-${c}`}
              className={`cell ${selected?.r === r && selected?.c === c ? 'selected' : ''}`}
              onClick={() => handleCellClick(r, c)}
            />
          ))
        ))}
        <AnimatePresence>
          {board.flatMap((row, r) => 
            row.map((ball, c) => {
              if (!ball) return null;
              
              const x = 7 + c * 32;
              const y = 7 + r * 32;

              return (
                <motion.div
                  key={ball.id}
                  initial={{ x, y: y - 300, opacity: 0, scale: 0.5 }}
                  animate={{ x, y, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    mass: 0.8
                  }}
                  className={`ball ${ball.color}`}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function createEmptyInitial(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export default App;
