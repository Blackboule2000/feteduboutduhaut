import React, { useEffect, useState } from 'react';

interface TimerUnitProps {
  value: number;
  label: string;
}

const TimerUnit: React.FC<TimerUnitProps> = ({ value, label }) => {
  const formattedNumber = value.toString().padStart(2, '0');
  
  return (
    <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
      <div 
        className="relative w-32 h-32 bg-[#f6d9a0] rounded-full border-4 border-[#ca5231] flex items-center justify-center shadow-lg"
        style={{
          boxShadow: '0 4px 6px rgba(202, 82, 49, 0.1), 0 1px 3px rgba(202, 82, 49, 0.08)',
          transform: 'rotate(-2deg)'
        }}
      >
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ca5231"
              strokeWidth="8"
              strokeDasharray={`${(value / (label === 'JOURS' ? 100 : 60)) * 251.2} 251.2`}
              transform="rotate(-90 50 50)"
              style={{
                transition: 'stroke-dasharray 1s linear'
              }}
            />
          </svg>
        </div>
        <span 
          className="text-5xl font-['Railroad Gothic'] text-[#ca5231] relative z-10"
          style={{
            textShadow: '2px 2px 0px rgba(202, 82, 49, 0.2)'
          }}
        >
          {formattedNumber}
        </span>
      </div>
      <span 
        className="mt-4 text-xl font-['Swiss 721 Black Extended BT'] text-[#ca5231] tracking-wider"
        style={{
          textShadow: '1px 1px 0px rgba(202, 82, 49, 0.1)'
        }}
      >
        {label}
      </span>
    </div>
  );
};

interface FlipTimerProps {
  targetDate: Date;
}

const FlipTimer: React.FC<FlipTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative">
      {/* Hirondelles autour du timer */}
      <div className="absolute -top-20 -left-16 transform rotate-[25deg]">
        <img 
          src="http://www.image-heberg.fr/files/17472137482209719273.png" 
          alt="Hirondelle" 
          className="w-12 h-auto animate-pulse"
          style={{ opacity: 0.8 }}
        />
      </div>
      <div className="absolute -top-24 right-20 transform -rotate-[15deg]">
        <img 
          src="http://www.image-heberg.fr/files/17472137482209719273.png" 
          alt="Hirondelle" 
          className="w-10 h-auto animate-pulse"
          style={{ opacity: 0.7, animationDelay: '1s' }}
        />
      </div>
      <div className="absolute -top-16 right-[-4rem] transform rotate-[10deg]">
        <img 
          src="http://www.image-heberg.fr/files/17472137482209719273.png" 
          alt="Hirondelle" 
          className="w-8 h-auto animate-pulse"
          style={{ opacity: 0.6, animationDelay: '0.5s' }}
        />
      </div>

      <div className="flex justify-center items-center gap-12 p-8">
        <TimerUnit value={timeLeft.days} label="JOURS" />
        <TimerUnit value={timeLeft.hours} label="HEURES" />
        <TimerUnit value={timeLeft.minutes} label="MINUTES" />
        <TimerUnit value={timeLeft.seconds} label="SECONDES" />
      </div>
    </div>
  );
};

export default FlipTimer;