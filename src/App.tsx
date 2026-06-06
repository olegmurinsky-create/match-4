import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBar from './StatusBar';
import BottomBar from './BottomBar';
import { 
  Board, 
  createInitialBoard, 
  findMatches, 
  findAPossibleMove,
  Color,
  DEFAULT_COLORS,
  GameModeStrategy,
  removeMatches,
  hasPossibleMoves
} from './gameLogic';
import { SurvivalStrategy } from './modes/survival';
import { EndlessStrategy } from './modes/endless';
import './App.css';

interface Position {
  r: number;
  c: number;
}

interface ScoreEntry {
  name: string;
  score: number;
  timestamp?: number;
}

type GameMode = 'survival' | 'endless';
type GameState = 'mode_select' | 'playing' | 'level_clear' | 'game_over' | 'leaderboard';

function App() {
  const [board, setBoard] = useState<Board>([]);
  const [selected, setSelected] = useState<Position | null>(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [ballsPopped, setBallsPopped] = useState<number>(0);
  const [targetBalls, setTargetBalls] = useState<number>(75);
  const [colorPool, setColorPool] = useState<Color[]>(DEFAULT_COLORS);
  const [gameMode, setGameMode] = useState<GameMode>('survival');
  const [gameState, setGameState] = useState<GameState>('mode_select');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [isFeverMode, setIsFeverMode] = useState<boolean>(false);
  const [feverTimeLeft, setFeverTimeLeft] = useState<number>(20);
  const [hintedBallIds, setHintedBallIds] = useState<string[]>([]);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const hintIntervalRef = useRef<number | null>(null);
  const persistentHintRef = useRef<Position[] | null>(null);
  const gameStateRef = useRef<GameState>('mode_select');
  const [activeCombo, setActiveCombo] = useState<number>(0);

  const getStrategy = useCallback((mode: GameMode): GameModeStrategy => {
    return mode === 'survival' ? new SurvivalStrategy() : new EndlessStrategy();
  }, []);

  const ballVariants = {
    initial: (custom: { x: number, y: number }) => ({
      x: custom.x,
      y: custom.y - 300,
      opacity: 0,
      scale: 0.5
    }),
    animate: (custom: { x: number, y: number }) => ({
      x: custom.x,
      y: custom.y,
      opacity: 1,
      scale: 1,
    }),
    hint: {
      rotate: [-3, 3, -3, 3, 0],
      scale: [1, 1.25, 1, 1.25, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      }
    },
    exit: {
      opacity: 0,
      scale: 0
    }
  };


  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`match-4-leaderboard-${gameMode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setLeaderboard(parsed.slice(0, 9));
      } else {
        setLeaderboard([]);
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
      setLeaderboard([]);
    }
  }, [gameMode]);

  const saveScore = () => {
    if (playerName.trim().length === 3) {
      const newEntry: ScoreEntry = { 
        name: playerName.toUpperCase(), 
        score, 
        timestamp: Date.now() 
      };
      const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (b.timestamp || 0) - (a.timestamp || 0);
      }).slice(0, 9);
      
      setLeaderboard(newLeaderboard);
      try {
        localStorage.setItem(`match-4-leaderboard-${gameMode}`, JSON.stringify(newLeaderboard));
      } catch (e) {
        console.error('Failed to save leaderboard', e);
      }
      setPlayerName('');
      setScoreSaved(true);
    }
  };

  // Initialize board on mount safely
  useEffect(() => {
    setBoard(createInitialBoard());
    setIsProcessing(false);
  }, []);

  // Fever Mode Timer
  useEffect(() => {
    if (gameState === 'playing' && isFeverMode) {
      const timer = setInterval(() => {
        setFeverTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFeverMode(false);
            // Ask the strategy what to do when fever ends
            const nextState = getStrategy(gameMode).onFeverEnd();
            setGameState(nextState);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, isFeverMode, gameMode, getStrategy]);

  const stopHinting = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
    setHintedBallIds([]);
    persistentHintRef.current = null;
  }, []);

  const startIdleTimer = useCallback(() => {
    stopHinting(); // Stop any previous timers/hints

    if (gameState === 'playing' && !isProcessing) {
      idleTimeoutRef.current = window.setTimeout(() => {
        // Find a move ONCE and store it in a ref
        const move = findAPossibleMove(board);
        if (!move) return;
        
        persistentHintRef.current = move;

        // Function to show the hint
        const showHint = () => {
          if (persistentHintRef.current) {
            const move = persistentHintRef.current;
            const ball1 = board[move[0].r][move[0].c];
            const ball2 = board[move[1].r][move[1].c];
            if (ball1 && ball2) {
              setHintedBallIds([ball1.id, ball2.id]);
              setTimeout(() => setHintedBallIds([]), 1500); 
            }
          }
        };

        showHint(); // Show hint immediately
        hintIntervalRef.current = window.setInterval(showHint, 4000); // Repeat every 4s

      }, 7000); // Wait 7s for initial inactivity
    }
  }, [board, gameState, isProcessing, stopHinting]);

  // Effect to manage the idle timer
  useEffect(() => {
    startIdleTimer();
    return stopHinting; // Cleanup on unmount or when dependencies change
  }, [gameState, isProcessing, board, startIdleTimer, stopHinting]);

  const processCascades = useCallback(async (currentBoard: Board) => {
    let b = currentBoard;
    let s = score;
    let p = ballsPopped;
    let matchResult = findMatches(b);
    let multiplier = 1;
    let feverActive = isFeverMode;
    let currentCombo = 0;
    
    const strategy = getStrategy(gameMode);

    while (matchResult.hasMatch) {
      if (gameStateRef.current !== 'playing') {
        break; // Abort if player hits restart
      }

      const matchCount = matchResult.matchedPositions.length;
      p += matchCount;
      setBallsPopped(p);
      
      currentCombo++;
      setActiveCombo(currentCombo);

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

      // Check for fever mode activation *after* calculating points but *before* applying multiplier
      if (gameMode === 'survival' && !feverActive && p >= targetBalls) {
        feverActive = true;
        setIsFeverMode(true);
        setFeverTimeLeft(20);
      }

      const feverMultiplier = feverActive ? 2 : 1;
      s += basePoints * multiplier * feverMultiplier;
      setScore(s);
      multiplier++;
      
      // Remove matches, triggering exit animation
      b = removeMatches(b, matchResult.matchedPositions);
      setBoard(b);
      
      // Wait for disappearing animation
      await new Promise(res => setTimeout(res, 200));
      
      if (gameStateRef.current !== 'playing') break;

      // Apply strategy's fillSpaces (which may apply gravity and refill)
      b = strategy.fillSpaces(b, colorPool);
      setBoard(b);
      
      // Wait for falling animation to settle
      await new Promise(res => setTimeout(res, 300));
      
      matchResult = findMatches(b);
    }
    
    setActiveCombo(0);

    if (gameStateRef.current !== 'playing') {
      setIsProcessing(false);
      return;
    }

    // Process Level Progression
    const progression = strategy.processLevelProgression(p, level, targetBalls, colorPool);
    if (progression.level !== level) setLevel(progression.level);
    if (progression.targetBalls !== targetBalls) setTargetBalls(progression.targetBalls);
    if (progression.colorPool.length !== colorPool.length) setColorPool(progression.colorPool);
    
    // Check level end condition
    if (strategy.checkGameOver(b, p, targetBalls, feverActive)) {
      setGameState('game_over');
    } else if (!hasPossibleMoves(b) && gameMode === 'survival') {
      if (feverActive) {
        // Let the timer run out
      } else if (p >= targetBalls) {
        setGameState('level_clear');
      } else {
        setGameState('game_over');
      }
    }

    setIsProcessing(false);
  }, [score, ballsPopped, targetBalls, level, isFeverMode, colorPool, gameMode, getStrategy]);

  // And in handleCellClick:
  // processCascades(tempBoard); instead of processCascades(tempBoard, score, ballsPopped);

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing || gameState !== 'playing') return;
    
    // Player made an action, so restart the idle timer
    startIdleTimer();

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
      processCascades(tempBoard);
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
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setBallsPopped(0);
    setTargetBalls(55 + nextLevel * 20);
    setBoard(createInitialBoard(colorPool));
    setGameState('playing');
    setIsFeverMode(false);
    setFeverTimeLeft(20);
  };

  const startNewGame = (mode: GameMode) => {
    setGameMode(mode);
    setLevel(1);
    setScore(0);
    setBallsPopped(0);
    setTargetBalls(mode === 'survival' ? 75 : 150); // 150 (50*1*1+100) for endless milestone
    setColorPool(DEFAULT_COLORS);
    setBoard(createInitialBoard(DEFAULT_COLORS));
    setGameState('playing');
    setIsFeverMode(false);
    setFeverTimeLeft(20);
    setScoreSaved(false);
    setActiveCombo(0);
    setIsProcessing(false);
  };

  const restartGame = () => {
    setGameState('mode_select');
    // Set isProcessing to true to stop any background loops.
    // The state will be fully reset in startNewGame.
    setIsProcessing(true);
  };

  return (
    <div className={`game-container ${false && activeCombo >= 3 ? 'screen-shake' : ''}`}>
      {gameState === 'mode_select' ? (
        <div className="overlay mode-select">
          <h1>Match-4</h1>
          <div className="mode-options">
            <button className="mode-btn" onClick={() => startNewGame('survival')}>
              <h2>Survival Mode</h2>
              <p>Reach target score to level up.</p>
            </button>
            <button className="mode-btn" onClick={() => startNewGame('endless')}>
              <h2>Endless Mode</h2>
              <p>Continuous cascades. Auto-refills.</p>
            </button>
          </div>
        </div>
      ) : (
        <>
          <StatusBar 
            score={score}
            level={level}
            ballsPopped={ballsPopped}
            targetBalls={targetBalls}
            onRestart={restartGame}
            gameMode={gameMode}
          />
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

                  const isHinted = hintedBallIds.includes(ball.id);
                  return (
                    <motion.div
                      key={ball.id}
                      variants={ballVariants}
                      custom={{ x, y }}
                      initial="initial"
                      animate={isHinted ? ["animate", "hint"] : "animate"}
                      exit="exit"
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
                {!scoreSaved && (
                  <>
                    <h2>Game Over</h2>
                    <p>Final Score: {score}</p>
                  </>
                )}
                
                {!scoreSaved && (
                  <div className="leaderboard-entry">
                    <input 
                      maxLength={3} 
                      placeholder="AAA" 
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value.replace(/[^A-Za-zА-Яа-я0-9]/g, '').toUpperCase())}
                    />
                    <button disabled={playerName.length !== 3} onClick={saveScore}>Save</button>
                  </div>
                )}

                {scoreSaved && leaderboard.length > 0 && (
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

                <button className="restart-btn" disabled={isProcessing} onClick={restartGame}>Menu</button>
              </div>
            )}
          </div>
          <BottomBar 
            isFeverMode={isFeverMode}
            time={`${Math.floor(feverTimeLeft / 60)}:${(feverTimeLeft % 60).toString().padStart(2, '0')}`}
          />
          <button 
            onClick={() => { setScore(20000); setGameState('game_over'); setIsProcessing(false); }} 
            style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 100, background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
          >
            DEBUG: Game Over (20k)
          </button>
        </>
      )}
    </div>
  );
}

export default App;
