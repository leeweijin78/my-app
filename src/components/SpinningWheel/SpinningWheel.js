import React, { useRef, useEffect } from "react";
import "./SpinningWheel.css";

const SpinningWheel = ({ prizes, selectedPrize, isSpinning, onSpinEnd }) => {
  const wheelRef = useRef(null);

  useEffect(() => {
    if (isSpinning && selectedPrize) {
      const prizeIndex = prizes.findIndex(
        (prize) => prize.name === selectedPrize.name
      );
      const prizeAngle = 360 / prizes.length;
      const randomOffset = Math.random() * prizeAngle;
      const newRotation =
        (prizeIndex * prizeAngle + randomOffset + 360 * 5) % 360; // 5 full rotations

      wheelRef.current.style.transition = "transform 4s ease-out";
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;

      const handleTransitionEnd = () => {
        wheelRef.current.removeEventListener(
          "transitionend",
          handleTransitionEnd
        );
        onSpinEnd();
      };

      wheelRef.current.addEventListener("transitionend", handleTransitionEnd);
    }
  }, [isSpinning, selectedPrize, prizes, onSpinEnd]);

  return (
    <div className="wheel-container">
      <div className="wheel" ref={wheelRef}>
        {prizes.map((prize, index) => (
          <div
            key={index}
            className="wheel-segment"
            style={{
              transform: `rotate(${index * (360 / prizes.length)}deg)`,
              backgroundColor: prize.color, // Assign color to the segment
            }}
          >
            {prize.name}
          </div>
        ))}
      </div>
      <div className="pointer"></div>
    </div>
  );
};

export default SpinningWheel;
