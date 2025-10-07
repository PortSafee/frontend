"use client";

import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios, { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [condominio, setCondominio] = useState('');
  const [bloco, setBloco] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [userType, setUserType] = useState('Morador');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCpf = (cpf: string) => {
    return cpf.replace(/\D/g, '').length === 11;
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Formato de email inválido. Use @ e .');
      return;
    }
    if (!validateCpf(cpf)) {
      setError('CPF deve ter 11 dígitos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Senhas não coincidem.');
      return;
    }

    const endereco = `Condomínio: ${condominio}, Bloco: ${bloco}, Apartamento: ${apartamento}, CPF: ${cpf}`;

    try {
      const response = await axios.post('http://localhost:5128/api/Auth/cadastro', {
        Email: email,
        Senha: password,
        Nome: name,
        Telefone: phone,
        Endereco: endereco,
        Tipo: userType
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setSuccess('Cadastro realizado com sucesso!');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setCpf('');
        setCondominio('');
        setBloco('');
        setApartamento('');
        setUserType('Morador');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Error || 'Erro no registro. Tente novamente!';
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
      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-auto">
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Criar Nova Conta</h1>
            <h3>Escolha seu tipo de usuário e complete o cadastro</h3>
          </div>
          <img src={IconLogo.src} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>
        <ToggleButton onToggle={setUserType} options={['Morador', 'Porteiro']} />
        <div className="px-2 sm:px-5 md:px-10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-left mt-4 text-lg pl-4">Nome Completo</p>
            <Input
              placeholder="Insira seu nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10"
            />
            <p className="text-left mt-4 text-lg pl-4">Senha</p>
            <Input
              placeholder="Insira aqui sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10"
            />
            <p className="text-left mt-4 text-lg pl-4">Telefone</p>
            <Input
              placeholder="(15) 9999-9999"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10"
            />
          </div>
          <div>
            <p className="text-left mt-4 text-lg pl-4">E-mail</p>
            <Input
              placeholder="Insira aqui seu e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10"
            />
            <p className="text-left mt-4 text-lg pl-4">Confirmar Senha</p>
            <Input
              placeholder="Reescreva sua senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10"
            />
            <p className="text-left mt-4 text-lg pl-4">CPF</p>
            <Input
              placeholder="123.456.789-01"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>
        <div className="px-2 sm:px-5 md:px-10 grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-left mt-4 text-lg pl-4">Condomínio</p>
            <Select
              placeholder="Selecione aqui"
              value={condominio}
              onChange={(e) => setCondominio(e.target.value)}
              className="w-full h-10"
              options={['Opção 1', 'Opção 2']}
            />
          </div>
          <div>
            <p className="text-left mt-4 text-lg pl-4">Bloco</p>
            <Select
              placeholder="Selecione aqui"
              value={bloco}
              onChange={(e) => setBloco(e.target.value)}
              className="w-full h-10"
              options={['Opção 1', 'Opção 2']}
            />
          </div>
          <div>
            <p className="text-left mt-4 text-lg pl-4">Apartamento</p>
            <Select
              placeholder="Selecione aqui"
              value={apartamento}
              onChange={(e) => setApartamento(e.target.value)}
              className="w-full h-10"
              options={['Opção 1', 'Opção 2']}
            />
          </div>
        </div>
        <Button onClick={handleRegister} label="Criar Nova Conta" />
        <h2 className="text-gray-400 text-sm mt-0.5 mb-2">
          Já tem uma conta?
        </h2>
        <a href="/login" className="text-blue-300 block text-sm mt-0 hover:underline">
          Faça login aqui!
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;