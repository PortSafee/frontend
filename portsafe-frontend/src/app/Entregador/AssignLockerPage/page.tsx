"use client";

import React from "react";
import Button from "@/components/Button";
import Logo from "@/assets/logo_portsafe.png";


// Exemplo com valor temporário
const armario = "015";

const AssignLockerPage: React.FC = () => {
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
                        <p>Passo 3 de 4</p>
                        <p>75%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-700 rounded-full">
                        <div className="h-3 bg-gradient-to-r from-[#00C2FF] to-[#007BFF] rounded-full w-3/4"></div>
                    </div>
                </div>

                {/* Card principal */}
                <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
                    {/* Cabeçalho do card */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
                        <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">
                            Designando Armário...
                        </h1>
                        <h3 className="text-sm sm:text-base opacity-90">
                            Aguardando liberação
                        </h3>
                    </div>

                    {/* Armário Designado */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff18] rounded-2xl m-6 mt-6 p-4 border-2 border-[#606060]">
                        <p className="text-center text-sm sm:text-base text-white font-bold mt-8">
                            ARMÁRIO DESIGNADO
                        </p>
                        <p className="text-8xl font-bold text-white mt-5 mb-5">
                            {armario}
                        </p>
                        <div className="inline-flex items-center bg-[#3B82F6] text-white font-semibold py-1 px-2 w-auto rounded-md mb-8">
                            Preparando Abertura 
                        </div>

                    </div>

                    {/* Instruções */}
                    <div className="px-4 sm:px-8 md:px-4 bg-[#3389f11a] rounded-2xl m-6 mt-0 p-4 border-2 border-[#1F9CE4]">
                        <p className="text-left text-sm sm:text-base text-white font-bold pt-3">
                            Instruções:
                        </p>
                        <p className="text-sm sm:text-base text-white mt-2 pb-3">
                            O armário está sendo preparado. Em breve ele será liberado para você.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignLockerPage;