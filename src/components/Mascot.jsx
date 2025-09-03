import { useEffect, useState } from "react";

export default function Mascot({ strength }) {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (strength === 4) {
      setConfetti(true);
      const timer = setTimeout(() => setConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [strength]);

  const face = () => {
    if (strength <= 1) return "😟";
    if (strength <= 3) return "😐";
    return "😃";
  };

  return (
    <div className="relative flex justify-center items-center my-4">
      <div className="text-6xl transition-all duration-500">{face()}</div>
      {confetti && (
        <div className="absolute -top-4 -left-4 w-32 h-32 pointer-events-none">
          <div className="absolute w-2 h-2 bg-yellow-400 animate-bounce rounded-full" style={{top:'10px', left:'10px'}}></div>
          <div className="absolute w-2 h-2 bg-red-400 animate-bounce rounded-full" style={{top:'20px', left:'50px'}}></div>
          <div className="absolute w-2 h-2 bg-green-400 animate-bounce rounded-full" style={{top:'40px', left:'20px'}}></div>
          <div className="absolute w-2 h-2 bg-blue-400 animate-bounce rounded-full" style={{top:'30px', left:'70px'}}></div>
        </div>
      )}
    </div>
  );
}