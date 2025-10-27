"use client";

import React from "react";
import Button from "@/components/Button";
import Logo from "@/assets/logo_portsafe.png";
import { BsPeople } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";


// Exemplo com valor temporário
const destinatario = "João Silva";
const apartamento = "1205, Bloco A - 804";
const rua = "Rua das flores, 123";
const localizacao = "Jardim das Acácias - São Paulo/SP";
const cep = "0123-567";


const RegisterDeliveryPage: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
            {/* Lado esquerdo - Logo e nome */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
                <img
                    src={Logo.src}
                    alt="Logo PortSafe"
                    className="w-50 sm:w-60 md:w-80 mb-2 max-w-full"
                />
                <p className="text-white text-lg sm:text-xl md:text-2xl">
                    Sistema de Entregas do Condomínio
                </p>
            </div>

            {/* Lado direito - Formulário */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 overflow-y-auto">
                {/* Barra de progresso */}
                <div className="w-150 sm:w-125 md:w-150 max-w-full mr-0 md:mr-16 mb-6">
                    <div className="flex justify-between items-center text-white text-xs sm:text-sm mb-1">
                        <p>Passo 2 de 4</p>
                        <p>50%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full">
                        <div className="h-3 bg-gradient-to-r from-[#00C2FF] to-[#007BFF] rounded-full w-1/2"></div>
                    </div>
                </div>

                {/* Card de registro */}
                <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
                    {/* Cabeçalho do card */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
                        <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">
                            Endereço Validado!
                        </h1>
                        <h3 className="text-sm sm:text-base opacity-90">
                            Os dados foram confirmados com sucesso.
                        </h3>
                    </div>

                    {/* Dados da Entrega */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff18] rounded-2xl m-6 mt-6 p-4 border-2 border-[#606060]">
                        <p className="text-left text-sm sm:text-base text-white font-bold flex items-center">
                            <BsPeople className="inline-block mr-2 text-xl text-[#0CB0D8]" />
                            Dados da Entrega
                        </p>

                        {/* Linha 1 - Destinatário */}
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm sm:text-base font-thin text-white">
                                Destinatário:
                            </p>
                            <p className="text-sm sm:text-base font-bold text-white">
                                {destinatario}
                            </p>
                        </div>

                        {/* Linha 2 - Apartamento */}
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm sm:text-base font-thin text-white">
                                Apartamento:
                            </p>
                            <p className="text-sm sm:text-base font-bold text-white">
                                {apartamento}
                            </p>
                        </div>
                    </div>


                    {/* Endereço */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-6 p-4 border-2 border-[#1FC364]">
                        <p className="text-left text-sm sm:text-base text-white font-bold flex items-center">
                            <CiLocationOn className="inline-block mr-2 text-xl text-[#1FC364]" />
                            Endereço
                        </p>
                        <div className="flex items-center mt-4">
                            <p className="text-sm sm:text-base font-thin text-white">
                                {rua}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm sm:text-base font-thin text-white">
                                {localizacao}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm sm:text-base font-thin text-white">
                                CEP: {cep}
                            </p>
                        </div>
                        <div className="bg-[#1fc364] text-white font-bold h-auto min-h-[1vh] w-fit min-w-[12vw] px-4 rounded-2xl mt-2 border-2 border-[#1FC364] flex items-center justify-center text-center">
                            Validado no Sistema
                        </div>
                    </div>

                    {/* Botão */}
                    <div className="flex flex-col justify-center px-4 sm:px-6 mb-6">
                        <Button
                            nome="Confirmar e Continuar"
                            estilo="primary"
                            className="!w-133 max-w-full text-white text-xs sm:text-sm md:text-base mb-4"
                        />
                        <Button
                            nome="Redigitar Dados"
                            estilo="transparent"
                            className="!w-133 max-w-full text-white !bg-[#00000000] text-xs sm:text-sm md:text-base"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterDeliveryPage;