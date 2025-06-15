import React, { useEffect, useState } from 'react';

interface StudyTimerProps {
  onTimeUpdate?: (minutes: number) => void;
  onSessionComplete?: (totalMinutes: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  onTimeUpdate,
  onSessionComplete
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [goal, setGoal] = useState(25); // Default 25 minutes
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeUpdate?.(Math.floor(newTime / 60));
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    if (time >= goal * 60) {
      setIsRunning(false);
      setIsBreak(true);
      onSessionComplete?.(Math.floor(time / 60));
    }
  }, [time, goal, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsBreak(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setIsBreak(false);
  };

  const handleGoalChange = (newGoal: number) => {
    setGoal(newGoal);
    if (isRunning) {
      handleReset();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Study Timer</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Goal:</span>
          <select
            value={goal}
            onChange={(e) => handleGoalChange(Number(e.target.value))}
            className="p-1 border rounded"
            disabled={isRunning}
          >
            <option value={15}>15 min</option>
            <option value={25}>25 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-500">
          {isBreak ? 'Time for a break!' : 'Focus time'}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${
            isBreak ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min((time / (goal * 60)) * 100, 100)}%` }}
        />
      </div>

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      {isBreak && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          Great job! Take a 5-minute break before your next session.
        </div>
      )}
    </div>
  );
}; 