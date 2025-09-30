"use client";

import React from 'react';

interface SelectProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ placeholder, value, onChange, className, options }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full h-10 p-2  text-gray-400 border border-gray-600 rounded-xl ${className}`}
    >
      <option value="" disabled className="text-gray-400">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option} className="text-white bg-gray-700">{option}</option>
      ))}
    </select>
  );
};

export default Select;