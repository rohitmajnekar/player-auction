import React, { useMemo, useState, useContext, useEffect } from "react";
import "./Spinner.css";
import { SocketContext } from "./SocketContext";
import { use } from "react";



const Spinner = ({
  size = 360,
  onClose = () => {},
  onResult = () => {},
  spinTheWheel
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const socket = useContext(SocketContext);
  
  const [WHEEL_ITEMS, setWheelItems] = useState([]);
  const segmentAngle = 360 / WHEEL_ITEMS.length;
    useEffect(() => {
      if( WHEEL_ITEMS.length > 0) {
        spinWheel();
      }
    }, [spinTheWheel]);

    useEffect(() => {
        socket.on("selectedTeams", (msg) => {
            if (!msg || !Array.isArray(msg)) {
                console.error("Invalid teams list received:", msg);
                return;
            }
            setWheelItems([]); // Clear existing items before adding new ones
            console.log("wheel:", WHEEL_ITEMS);
            const formattedTeams = msg.map((team) => ({
            label: team,
            }));
            setWheelItems(formattedTeams);
        });
    }, []);

  const wheelBackground = useMemo(() => {
    const colors = [
      "#00F5FF",
      "#FF0080",
      "#7C4DFF",
      "#00E676",
      "#FF9100",
      "#FF1744",
    ];

    return WHEEL_ITEMS.map((_, i) => {
      const start = i * segmentAngle;
      const end = (i + 1) * segmentAngle;

      return `${colors[i % colors.length]} ${start}deg ${end}deg`;
    }).join(", ");
  }, [segmentAngle]);

  const spinWheel = () => {
    if (isSpinning && (WHEEL_ITEMS.length===0)) return;

    setWinner("");
    setIsSpinning(true);

    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const randomOffset = Math.floor(Math.random() * 360);

    const finalRotation = rotation + extraSpins + randomOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      const normalized =
        ((360 - (finalRotation % 360)) + segmentAngle / 2) % 360;

      const index =
        Math.floor(normalized / segmentAngle) % WHEEL_ITEMS.length;

      const result = WHEEL_ITEMS[index].label;

      setWinner(result);
      setIsSpinning(false);

      onResult(result);
    }, 5200);
  };

  return (
    <div className="wheel-overlay">
      <div className="wheel-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div
          className="pointer"
          style={{
            borderLeftWidth: `${size * 0.05}px`,
            borderRightWidth: `${size * 0.05}px`,
            borderBottomWidth: `${size * 0.1}px`,
          }}
        />

        <div
          className="wheel-wrap"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <div
            className="wheel"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${wheelBackground})`,
            }}
          >
            {WHEEL_ITEMS.map((item, index) => {
              const angle = segmentAngle * index + segmentAngle / 2;

              return (
                <div
                  key={item.label}
                  className="wheel-label"
                  style={{
                    width: `${size * 0.22}px`,
                    marginLeft: `-${size * 0.11}px`,
                    transform: `
                      rotate(${angle}deg)
                      translateY(-${size * 0.33}px)
                      rotate(90deg)
                    `,
                  }}
                >
                  <span
                    style={{
                      fontSize: `${size * 0.045}px`,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}

            <div
              className="wheel-center"
              style={{
                width: `${size * 0.18}px`,
                height: `${size * 0.18}px`,
              }}
            />
          </div>
        </div>

        <button
          className="spin-btn"
          onClick={spinWheel}
          disabled={isSpinning}
        >
          {isSpinning ? "Spinning..." : "SPIN"}
        </button>

        {winner && !isSpinning && (
          <div className="result-text">
            🎉 {winner}
          </div>
        )}
      </div>
    </div>
  );
};

export default Spinner;