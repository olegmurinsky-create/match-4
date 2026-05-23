import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  score: number;
  level: number;
  ballsPopped: number;
  targetBalls: number;
  onRestart: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ score, level, ballsPopped, targetBalls, onRestart }) => {
  const progressPercent = targetBalls > 0 ? (ballsPopped / targetBalls) * 100 : 0;

  return (
    <div className="status-bar-container">
      
      <div className="status-left">
        <span className="level-text">LEVEL</span>
        <span className="level-value">{level}</span>
      </div>

      <div className="status-center">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          <div className="progress-bar-text">{`${ballsPopped} / ${targetBalls}`}</div>
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
