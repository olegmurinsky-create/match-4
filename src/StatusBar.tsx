import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  score: number;
  level: number;
  ballsPopped: number;
  targetBalls: number;
  onRestart: () => void;
  gameMode?: 'survival' | 'endless';
}

const StatusBar: React.FC<StatusBarProps> = ({ score, level, ballsPopped, targetBalls, onRestart, gameMode = 'survival' }) => {
  // Ensure modulo logic doesn't cause a visual 0-width snap incorrectly if we've progressed
  let progressPercent = 0;
  let progressText = '';
  
  if (gameMode === 'survival') {
    progressPercent = targetBalls > 0 ? (ballsPopped / targetBalls) * 100 : 0;
    progressText = `${ballsPopped} / ${targetBalls}`;
  } else {
    let prevTarget = 0;
    if (level > 1) {
      prevTarget = 150; // initial target (50*1*1+100)
      for (let i = 2; i < level; i++) {
        prevTarget += 50 * i * i + 100;
      }
    }
    const currentProg = Math.max(0, ballsPopped - prevTarget);
    const interval = targetBalls - prevTarget;
    
    progressPercent = interval > 0 ? (currentProg / interval) * 100 : 0;
    if (ballsPopped > 0 && currentProg === interval) progressPercent = 100; // Keep full before processing
    
    progressText = `${currentProg} / ${interval}`;
  }

  return (
    <div className="status-bar-container">
      
      <div className="status-left">
        <span className="level-text">{gameMode === 'survival' ? 'LEVEL' : 'STAGE'}</span>
        <span className="level-value">{level}</span>
      </div>

      <div className="status-center">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          <div className="progress-bar-text">{progressText}</div>
        </div>
      </div>
      
      <div className="status-right">
        <span className="score-text">SCORE</span>
        <span className="score-value">{score.toString().padStart(5, '0')}</span>
        <button className="restart-button" onClick={onRestart} title="Restart">
          ↻
        </button>
      </div>

    </div>
  );
};

export default StatusBar;
