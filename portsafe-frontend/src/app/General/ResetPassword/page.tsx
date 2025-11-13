"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    // Validação: senhas iguais
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Validação: tamanho mínimo
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5128/api/Auth/reset-password',
        { NovaSenha: password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Senha redefinida com sucesso:', response.data);
      setError('');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro ao redefinir a senha. Tente novamente.');
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

            <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-4 sm:mx-6 md:mx-auto">

                <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
                    <div className="flex-1 text-center">
                        <h1 className="title font-marmelad text-2xl">Nova Senha</h1>
                        <h3>Digite sua nova senha</h3>
                    </div>
                    <img src={IconLogo.src} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
                </div>


                <div className="px-4 sm:px-10 md:px-20 mt-4 mb-4">
                    <p className="text-left text-lg pl-4 mt-4">Nova Senha</p>
                    <Input
                        placeholder="Insira aqui sua nova senha "
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-10 pl-4"
                    />

                    <p className="text-left text-lg pl-4 mt-4">Confirme sua Senha</p>
                    <Input
                        placeholder="Confira sua nova senha "
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 pl-4"
                    />

                    <Button
                        nome="Salvar e Redefinir"
                        estilo="primary"
                        clique={handleResetPassword}
                        className='mt-3 px-4 w-full text-sm sm:text-base md:text-base truncate'
                    />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;