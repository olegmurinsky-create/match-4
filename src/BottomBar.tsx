import React from 'react';
import './BottomBar.css';

interface BottomBarProps {
  isFeverMode: boolean;
  time: string; // MM:SS format
}

const BottomBar: React.FC<BottomBarProps> = ({ isFeverMode, time }) => {
  return (
    <div className="bottom-bar-container">
      <div className={`fever-timer-bottom ${!isFeverMode ? 'hidden' : ''}`}>
        FEVER TIME: {time}
      </div>
    </div>
  );
};

export default BottomBar;
