"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';

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
        setSuccess('E-mail validado! Redefina sua senha!');
        setEmail('');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Error || 'Tente novamente!';
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
        <div className="flex flex-col sm:flex-row items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px] gap-4">
          <div className="text-left sm:text-left">
            <h1 className="title font-marmelad text-2xl">Esqueceu a senha</h1>
            <h3>Recupere acesso à sua conta rapidamente</h3>
          </div>
          <img src={IconLogo.src} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        {/* Campo de email */}
        <div className="px-4 sm:px-10 md:px-20 mt-6 mb-4">
          <p className="text-left text-lg pl-4">E-mail</p>
          <Input
            placeholder="exemplo@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 pl-4 mt-1"
          />
          <h2 className="text-gray-400 text-sm mt-4">
            Enviaremos um código de verificação para o seu e-mail
          </h2>
        </div>

        {/* Botão */}
        <Button
          nome="Redefinir"
          estilo="secundary"
          clique={handleForgotPassword}
          className=' mb-6 px-4 w-full text-sm sm:text-base md:text-base truncate'
        />

      </div>
    </div>
  );
};

export default ForgotPasswordPage;