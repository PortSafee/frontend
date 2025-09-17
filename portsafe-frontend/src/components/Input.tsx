import React, { useState } from 'react';
import { InputText } from "primereact/inputtext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputProps {
  placeholder: string;
  type?: 'text' | 'password';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ placeholder, type = 'text', value, onChange }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-wrapper" style={{ position: 'relative', width: '30vw', margin: '0 auto' }}>
      <InputText
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          backgroundColor: '#343C42',
          color: '#757575',
          border: '1px solid #75716E',
          borderRadius: '15px',
          width: '100%',
          paddingRight: type === 'password' ? '40px' : '10px', // Espaço para o ícone
        }}
      />
      {type === 'password' && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#757575',
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}