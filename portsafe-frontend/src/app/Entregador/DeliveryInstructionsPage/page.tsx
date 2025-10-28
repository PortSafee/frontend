"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/assets/logo_portsafe.png";
import Button from "@/components/Button";

// Exemplo com valor temporário
const armario = "015";
    


const DeliveryInstructionsPage: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(120); 
    useEffect(() => {
        if (timeLeft <= 0) {
            alert("Tempo esgotado!");
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
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

            {/* Lado direito - Conteúdo */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 overflow-y-auto">
                {/* Barra de progresso */}
                <div className="w-150 sm:w-125 md:w-150 max-w-full mr-0 md:mr-16 mb-6">
                    <div className="flex justify-between items-center text-white text-xs sm:text-sm mb-1">
                        <p>Passo 4 de 4</p>
                        <p>100%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full">
                        <div className="h-3 bg-gradient-to-r from-[#00C2FF] to-[#007BFF] rounded-full w-full"></div>
                    </div>
                </div>

                {/* Card principal */}
                <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
                    {/* Cabeçalho do card */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
                        <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">
                            Armário Liberado!
                        </h1>
                        <h3 className="text-sm sm:text-base opacity-90">
                            Deposite a encomenda agora
                        </h3>
                    </div>

                    {/* Armário Designado */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-6 p-4 border-2 border-[#1FC364]">
                        <p className="text-center text-sm sm:text-base text-white font-bold">
                            ARMÁRIO DESIGNADO
                        </p>
                        <p className="text-5xl font-bold text-white mt-2">
                            {armario}
                        </p>
                        <div className="inline-flex items-center bg-[#1FC364] text-white font-semibold py-1 px-2 w-auto rounded-md mt-2 mb-2">
                            Aberto - Aguardando Depósito
                        </div>
                    </div>

                    {/* Tempo Restante */}
    <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff17] rounded-2xl m-6 mt-6 p-2 border-2 border-[#606060]">
        <p className="text-center text-sm sm:text-base text-white font-extralight">
            Tempo restante para depósito
        </p>
        <div className="inline-flex items-center text-3xl text-[#F77B14] font-bold py-1 px-2 w-auto rounded-md mt-1">
            {formatTime(timeLeft)}
        </div>
    </div>


                    {/* Instruções */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-0 p-4 border-2 border-[#1FC364]">
                        <p className="text-left text-sm sm:text-base text-[#83EAAA] font-bold">
                            Instruções:
                        </p>
                        <ol className="text-left text-sm sm:text-base text-[#83EAAA] mt-2 list-decimal pl-4">
                            <li className="-mb-2">Localize o armário {armario}</li>
                            <li className="-mb-2">Abra a porta (já está destrancada)</li>
                            <li className="-mb-2">Coloque a encomenda dentro</li>
                            <li className="-mb-2">Feche a porta completamente</li>
                            <li className="-mb-2">Clique em "Confirmar Depósito"</li>
                        </ol>
                    </div>

                    {/* Foto automática */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#3389f11a] rounded-2xl m-6 mt-0 p-4 border-2 border-[#1F9CE4]">
                        <p className="text-left text-sm sm:text-base text-white">
                            <span className="font-bold">Foto automática: </span>             
                            Uma foto será tirada assim que você fechar a porta do armário para registro de segurança.
                        </p>
                    </div>

                    {/* Botão */}
                    <div className="flex justify-center px-4 sm:px-6 mb-6">
                        <Button
                            nome="Confirmar Depósito"
                            estilo="primary"
                            className="!w-133 max-w-full text-white text-xs sm:text-sm md:text-base"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryInstructionsPage;