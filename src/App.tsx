import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Board, 
  createInitialBoard, 
  findMatches, 
  removeMatches, 
  applyGravity,
  hasPossibleMoves,
  ROWS,
  COLS
} from './gameLogic';
import './App.css';

interface Position {
  r: number;
  c: number;
}

interface ScoreEntry {
  name: string;
  score: number;
}

type GameState = 'playing' | 'level_clear' | 'game_over';

function App() {
  const [board, setBoard] = useState<Board>(() => createEmptyInitial());
  const [selected, setSelected] = useState<Position | null>(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [playerName, setPlayerName] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);

  const targetScore = level * 1000 - 500; // Level 1: 500, Level 2: 1500, Level 3: 2500...

  useEffect(() => {
    try {
      const saved = localStorage.getItem('match-4-leaderboard');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setLeaderboard(parsed);
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  }, []);

  const saveScore = () => {
    if (playerName.trim().length === 3) {
      const newLeaderboard = [...leaderboard, { name: playerName.toUpperCase(), score }].sort((a, b) => b.score - a.score).slice(0, 5);
      setLeaderboard(newLeaderboard);
      try {
        localStorage.setItem('match-4-leaderboard', JSON.stringify(newLeaderboard));
      } catch (e) {
        console.error('Failed to save leaderboard', e);
      }
      setPlayerName('');
    }
  };

  // Initialize board on mount safely
  useEffect(() => {
    setBoard(createInitialBoard());
    setIsProcessing(false);
  }, []);

  const processCascades = useCallback(async (currentBoard: Board, currentScore: number) => {
    let b = currentBoard;
    let s = currentScore;
    let matchResult = findMatches(b);
    let multiplier = 1;
    
    while (matchResult.hasMatch) {
      const matchCount = matchResult.matchedPositions.length;
      
      // Calculate score roughly by grouping into 4s and 5s if possible, or just base it on length
      // Proper grouping is complex, but to avoid 8-balls giving 160 instead of 80, 
      // we can count how many 4-matches fit in. For a simple fix:
      let basePoints = 0;
      if (matchCount < 4) {
         basePoints = 0; 
      } else if (matchCount === 4) {
         basePoints = 40;
      } else if (matchCount === 5) {
         basePoints = 100;
      } else {
         // Best effort for larger clusters
         basePoints = matchCount * 20;
      }

      s += basePoints * multiplier;
      setScore(s);
      multiplier++;
      
      // Remove matches, triggering exit animation
      b = removeMatches(b, matchResult.matchedPositions);
      setBoard(b);
      
      // Wait for disappearing animation
      await new Promise(res => setTimeout(res, 200));
      
      // Apply gravity, triggering fall animation (NO REFILL)
      b = applyGravity(b);
      setBoard(b);
      
      // Wait for falling animation to settle
      await new Promise(res => setTimeout(res, 300));
      
      matchResult = findMatches(b);
    }
    
    // Check level end condition
    if (!hasPossibleMoves(b)) {
      if (s >= targetScore) {
        setGameState('level_clear');
      } else {
        setGameState('game_over');
      }
    }

    setIsProcessing(false);
  }, [targetScore]);

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing || gameState !== 'playing') return;

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

    if (board[r][c] === null || board[selected.r][selected.c] === null) {
      setSelected(null);
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

  const startNextLevel = () => {
    setLevel(l => l + 1);
    setBoard(createInitialBoard());
    setGameState('playing');
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setBoard(createInitialBoard());
    setGameState('playing');
  };

  return (
    <div className="game-container">
      <div className="header">
        <h1>Match-4 <span className="level">Level {level}</span></h1>
        <div className="score-board">
          Score: {score} / {targetScore}
        </div>
        <button className="reset-button" disabled={isProcessing} onClick={() => {
          if (!isProcessing) {
            restartGame();
          }
        }}>Restart</button>
      </div>

      <div className="board">
        {board.map((row, r) => (
          row.map((_, c) => (
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

        {gameState === 'level_clear' && (
          <div className="overlay">
            <h2>Level {level} Cleared!</h2>
            <p>Score: {score}</p>
            <button disabled={isProcessing} onClick={startNextLevel}>Next Level</button>
          </div>
        )}

        {gameState === 'game_over' && (
          <div className="overlay game-over">
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
            
            <div className="leaderboard-entry">
              <input 
                maxLength={3} 
                placeholder="AAA" 
                value={playerName}
                onChange={e => setPlayerName(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
              />
              <button disabled={playerName.length !== 3} onClick={saveScore}>Save</button>
            </div>

            {leaderboard.length > 0 && (
              <div className="leaderboard">
                <h3>High Scores</h3>
                {leaderboard.map((entry, i) => (
                  <div key={i} className="leaderboard-row">
                    <span>{entry.name}</span>
                    <span>{entry.score}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="restart-btn" disabled={isProcessing} onClick={restartGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function createEmptyInitial(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export default App;
