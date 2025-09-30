"use client";

import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios, { AxiosError } from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Morador');
  const [error, setError] = useState('');

  //Validação do formato do email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Formato de email inválido. Use @ e .');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5128/api/Auth/login', {
        Email: email,
        Senha: password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { Token } = response.data;
      setError('');
      console.log('Login sucesso:', Token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Email e senha inexistente. Faça um cadastro!');
        console.error('Erro:', error.response?.data?.Error || 'Login falhou');
      } else {
        setError('Erro inesperado. Tente novamente!');
        console.error('Erro inesperado:', error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">

      {/*Exibição de erros através de notificação*/}
            {error && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">
          {error}
        </div>
      )}

      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-auto">
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Bem-vindo de volta</h1>
            <h3>Faça login para ter acesso à sua conta</h3>
          </div>
          <img src={IconLogo.src} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <ToggleButton onToggle={setUserType}/>

        <div className="px-4 sm:px-10 md:px-20">
          <p className="text-left mt-4 text-lg pl-4">E-mail</p>
          <Input
            placeholder="Insira aqui seu e-mail"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10"
          />

          <p className="text-left mt-4 text-lg pl-4">Senha</p>
          <Input
            placeholder="Insira aqui sua senha "
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10"
          />

          <a href="#" className="block text-left text-sm pl-4 mt-2 hover:underline">
            Esqueceu a senha?
          </a>

          <Button onClick={handleLogin} />

          <h2 className="text-gray-400 text-sm mt-0.5 mb-2">
            Não tem uma conta?
          </h2>
          <a href="/register" className="text-blue-300 block text-sm mt-0 hover:underline">
            Cadastre-se aqui
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;