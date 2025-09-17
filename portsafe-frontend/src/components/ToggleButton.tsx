"use client";

import React, { useState } from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

const ToggleButton: React.FC<{ onToggle: (selected: string) => void }> = ({ onToggle }) => {
  const [selected, setSelected] = useState('Morador');

  const handleToggle = (label: string) => {
    setSelected(label);
    onToggle(label);
  };

  const options = [
    { label: 'Morador', icon: <FaUser /> },
    { label: 'Porteiro', icon: <FaBuilding /> },
  ];

  return (
    <div className="flex justify-center gap-2 bg-gray-800 p-2 rounded-xl">
      {options.map(({ label, icon }) => (
        <button
          key={label}
          className={`flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${
            selected === label ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-blue-950 hover:bg-gray-600'
          }`}
          onClick={() => handleToggle(label)}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </button>
      ))}
      <style jsx>{`
        div {
          display: flex;
          background-color: #1f2535;
          padding: 4px;
          border-radius: 12px;
          width: 15vw;
          align-items: center;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default ToggleButton;