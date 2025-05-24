import React, { useEffect, useState } from 'react';

const logos = [
  './logos/1.jpg',
  './logos/5.jpg',
  './logos/4.jpg',
  './logos/3.jpg',
  './logos/2.jpg',
];

export default function LogoPopup({ show, onClose }) {
  const [highlighted, setHighlighted] = useState(null);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * logos.length);
      setHighlighted(randomIndex);

      setTimeout(() => {
        onClose(); // close popup
        setHighlighted(null);
      }, 1000); // short pause after highlight
    }, 5000); // 5s animation

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-full h-full flex justify-center items-center">
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            className={`w-24 h-24 absolute animate-float ${
              highlighted === i ? 'border-4 border-yellow-400 rounded-full' : ''
            }`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: '250px',
              height: '250px',
              margin: '10px'
            }}
            alt={`Logo ${i}`}
          />
        ))}
      </div>
    </div>
  );
}
