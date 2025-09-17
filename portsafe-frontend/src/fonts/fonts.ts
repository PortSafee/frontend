import { Marmelad, Inter } from 'next/font/google';

// Marmelad
export const marmelad = Marmelad({
  subsets: ['latin'], // Para acentos como "ç", "ã"
  weight: ['400'], 
  variable: '--font-marmelad',
  display: 'swap', // Swap evita FOUT (flash of unstyled text)
  fallback: ['cursive', 'sans-serif'],
});

// Inter
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});