import React, { useEffect, useState } from "react";

interface CountdownProps {
  endTimestamp: number; // The end timestamp in milliseconds
  className?: string;
  completed?: Function;
}

const Countdown: React.FC<CountdownProps> = ({
  endTimestamp,
  className,
  completed,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(
    endTimestamp - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (endTimestamp <= Date.now() && completed) {
        completed();
      }
      setTimeRemaining(endTimestamp - Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endTimestamp, completed]);

  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 3600) % 24);
    const days = Math.floor(time / 1000 / 3600 / 24);

    return (
      <>
        <div className="py-1">{days * 24 + hours}H</div>
        <div className="py-1">{minutes.toString().padStart(2, "0")}M</div>
        <div className="py-1">{seconds.toString().padStart(2, "0")}S</div>
      </>
    );
  };

  return <div className={className}>{formatTime(timeRemaining)}</div>;
};

export default Countdown;
