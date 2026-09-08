import React from 'react';

export const CSSQRCode = ({ passId = "PASS-2026-88" }) => {
  // Generates a deterministic grid pattern for visual QR representation
  const grid = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,1],
    [0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,1,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,1,1],
  ];

  return (
    <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200 inline-block">
      <div className="grid grid-cols-17 gap-0.5 w-36 h-36 sm:w-44 sm:h-44 bg-slate-100 p-1 rounded-lg">
        {grid.flat().map((cell, idx) => (
          <div
            key={idx}
            className={`${cell === 1 ? 'bg-slate-900' : 'bg-transparent'} rounded-xs`}
          />
        ))}
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">{passId}</p>
        <p className="text-[9px] text-emerald-600 font-semibold uppercase flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          VERIFIED DIGITAL QR
        </p>
      </div>
    </div>
  );
};
