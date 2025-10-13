"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios, { AxiosError } from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Formato de email inválido. Use @ e .');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5128/api/Auth/forgot-password',
        { Email: email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccess('Link de recuperação enviado para seu e-mail!');
        setEmail('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Error || 'Erro ao enviar link. Tente novamente!';
        setError(errorMessage);
        console.error('Erro:', errorMessage);
      } else {
        setError('Erro inesperado. Tente novamente!');
        console.error('Erro inesperado:', error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">

      {/* Notificações */}
      {error && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded">
          {success}
        </div>
      )}

      {/* Container principal */}
      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-4 sm:mx-6 md:mx-auto">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Esqueceu a senha</h1>
            <h3>Recupere acesso à sua conta rapidamente</h3>
          </div>
          <img src={IconLogo.src} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        {/* Campo */}
        <div className="px-4 mb-3 sm:px-10 md:px-20">
          <p className="text-left mt-4 text-lg pl-4">E-mail</p>
          <Input
            placeholder="exemplo@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 pl-4"
          />
        </div>
        <h2 className="text-gray-400 text-sm">
          Enviaremos um código de verificação para o seu e-mail
        </h2>

        {/* Botão */}
        <Button 
        nome="Enviar link de recuperação" 
        estilo="secundary" 
        clique={handleForgotPassword}
        className='mt-3 mb-4'
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;