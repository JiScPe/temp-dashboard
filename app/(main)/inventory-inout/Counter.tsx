import { useState, useEffect } from "react";

// Ease-out function for decelerating effect
const easeOutQuad = (t: number) => t * (2 - t);

const Counter = ({ start = 0, end = 1000, duration = 2000 }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Cap progress at 1
      const easedProgress = easeOutQuad(progress); // Apply easing
      const newCount = Math.floor(easedProgress * (end - start) + start);

      if (newCount <= end) {
        setCount(newCount);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [start, end, duration]);

  return <p className="text-4xl text-blue-600">{count}</p>;
};

export default Counter;
