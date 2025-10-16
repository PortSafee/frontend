"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/assets/logo_portsafe.png";
import Image from "next/image";

const RegisterDeliveryPage: React.FC = () => {
  const [tipoEntrega, setTipoEntrega] = useState<string>("");

  return (
    <div className="flex flex-col md:flex-row h-screen  bg-gradient-to-r from-[#002236] via-black to-[#002134]">
      {/* Lado esquerdo - Logo e nome */}
      <div className="flex flex-col justify-center items-center w-50 md:w-1/2 text-center p-6">
        <img
                    src={Logo.src}
                    alt="Logo PortSafe"
                    className="w-50 sm:w-100 mb-2"
                />
                <p className="text-white text-2xl ">
                    Sistema de Entregas do Condomínio
                </p>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
        {/* Barra de progresso */}
        <div className="w-150 mr-16 mb-6">
          <div className="flex justify-between items-center text-white text-sm mb-1">
            <p>Passo 1 de 4</p>
            <p>25%</p>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full">
            <div className="h-3 bg-gradient-to-r from-[#00C2FF] to-[#007BFF] rounded-full w-1/4"></div>
          </div>
        </div>

        {/* Card de registro */}
        <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 text-center shadow-lg overflow-hidden">
          {/* Cabeçalho do card */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
            <h1 className="title font-marmelad !text-3xl mb-1">Registrar Entrega</h1>
            <h3 className="text-base opacity-90">
              Preencha os dados do destinatário
            </h3>
          </div>

          {/* Inputs */}
         <div className="px-4 sm:px-10 md:px-6">
          <p className="text-left mt-4 text-base pl-5 text-white">Nome do Destinatário / Morador</p>
            <Input
              placeholder="Ex: João Silva"
              type="text"              
              className="!w-135 h-8 pl-4"
            />
            <p className="text-left mt-4 text-base pl-5 text-white">Número da Casa / Apartamento</p>
            <Input
              placeholder="Ex: 1205, Bloco A - Apt 804"
              type="text"              
              className="!w-135 h-8 pl-4"
            />
          </div>

          {/* Tipo de Entrega */}
           <p className="text-left mt-4 text-base pl-10 text-white">Tipo de Entrega</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 pl-8 pr-8">
            {/* Entrega Padrão */}
            <div
              onClick={() => setTipoEntrega("Padrão")}
              className={`cursor-pointer p-4 rounded-xl border ${
                tipoEntrega === "Padrão"
                  ? "border-[#0CB0D8] bg-[#ffffff26]" // cor da borda e do card com clique
                  : "border-transparent bg-[#ffffff26]" // cor da borda e do card sem clique
              } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-8 h-8 bg-[#00E096] rounded-full mx-auto mb-2"></div>
              <p className="text-gray-100 text-sm font-bold">Padrão</p>
              <p className="text-gray-400 text-xs">
                Encomendas, correspondências e documentos
              </p>
            </div>

                {/* Entrega Perecível */}
            <div
              onClick={() => setTipoEntrega("Perecível")}
              className={`cursor-pointer p-4 rounded-xl border ${
                tipoEntrega === "Perecível"
                  ? "border-[#0CB0D8] bg-[#ffffff26]" // cor da borda e do card com clique
                  : "border-transparent bg-[#ffffff26]" // cor da borda e do card sem clique
              } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-8 h-8 bg-[#0CB0D8] rounded-full mx-auto mb-2"></div>
              <p className="text-gray-100 text-sm font-bold">Perecível </p>
              <p className="text-gray-400 text-xs">
                Alimentos e/ou produtos refrigerados
              </p>
            </div>

            {/* Entrega Volumosa */}
            <div
              onClick={() => setTipoEntrega("Volumosa")}
              className={`cursor-pointer p-4 rounded-xl border ${
                tipoEntrega === "Volumosa"
                  ? "border-[#0CB0D8] bg-[#ffffff26]" // cor da borda e do card com clique
                  : "border-transparent bg-[#ffffff26]" // cor da borda e do card sem clique
              } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-8 h-8 bg-[#F77B14] rounded-full mx-auto mb-2"></div>
              <p className="text-gray-100 text-sm font-bold">Volumosa</p>
              <p className="text-gray-400 text-xs">
                Pacotes grandes que não cabem no armário
              </p>
            </div>
          </div>

          {/* Botão */}
          <Button 
          nome="Confirmar e Continuar" 
          estilo="primary"
          className="!w-133 ml-8 mb-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default RegisterDeliveryPage;
