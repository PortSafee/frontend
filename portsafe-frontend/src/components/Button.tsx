// components/Button.tsx
import React from 'react';
import { Button as PrimeButton } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface CustomButtonProps {
    label?: string;
    onClick?: () => void;
    icon?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}


export default function Button({ label = "Entrar", onClick }: CustomButtonProps) {
    return (
        <div className="card flex justify-center pb-3 pt-3">
            <PrimeButton
                label={label}
                onClick={onClick}
                style={{
                    background: 'linear-gradient(to right, #3489F2, #0BB0D7)',
                    border: 'none',
                    width: '20vw',
                    marginTop: '10px',
                }}
            />
        </div>
    );
}
