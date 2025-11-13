"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/assets/logo_portsafe.png";

const ManualRegisterPage: React.FC = () => {
  const [nomeEntregador, setNomeEntregador] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nomeDestinatario, setNomeDestinatario] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
      {/* Lado esquerdo - Logo e nome */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
        <img
          src={Logo.src}
          alt="Logo PortSafe"
          className="w-40 sm:w-56 md:w-72 lg:w-80 mb-4 max-w-full object-contain"
        />
        <p className="text-white text-base sm:text-lg md:text-2xl leading-snug">
          Sistema de Entregas do Condomínio
        </p>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 py-6 md:py-0 overflow-y-auto">
        {/* Card de registro */}
        <div className="w-full max-w-[600px] min-w-[280px] bg-[#ffffff18] border-2 border-[#606060] rounded-3xl text-white text-center shadow-xl">
          {/* Cabeçalho */}
          <div className="flex items-center justify-center p-4 bg-[#084571] rounded-t-3xl">
            <div className="flex flex-col space-y-1">
              <h1 className="title font-marmelad !text-2xl sm:!text-3xl md:text-3xl text-white leading-tight">
                Registro manual
              </h1>
              <p className="text-white text-xs sm:text-sm">
                Preencha os dados de entrega
              </p>
            </div>
          </div>

          {/* Conteúdo do formulário */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Primeira coluna */}
              <div className="flex flex-col">
                <p className="text-left mt-2 text-sm sm:text-base pl-1 text-white">
                  Nome do Entregador
                </p>
                <Input
                  placeholder="Ex: Carlos Silva"
                  type="text"
                  className="w-full h-10 pl-3 text-sm sm:text-base"
                  value={nomeEntregador}
                  onChange={(e) => setNomeEntregador(e.target.value)}
                />

                <p className="text-left mt-4 text-sm sm:text-base pl-1 text-white">
                  Nome do Morador
                </p>
                <Input
                  placeholder="Ex: Maria Oliveira"
                  type="text"
                  className="w-full h-10 pl-3 text-sm sm:text-base"
                  value={nomeDestinatario}
                  onChange={(e) => setNomeDestinatario(e.target.value)}
                />
              </div>

              {/* Segunda coluna */}
              <div className="flex flex-col">
                <p className="text-left mt-2 text-sm sm:text-base pl-1 text-white">
                  Empresa
                </p>
                <Input
                  placeholder="Ex: Expresso Silva"
                  type="text"
                  className="w-full h-10 pl-3 text-sm sm:text-base"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />

                <p className="text-left mt-4 text-sm sm:text-base pl-1 text-white">
                  Apartamento
                </p>
                <Input
                  placeholder="Ex: 1205, Bloco 4"
                  type="text"
                  className="w-full h-10 pl-3 text-sm sm:text-base"
                  value={apartamento}
                  onChange={(e) => setApartamento(e.target.value)}
                />
              </div>

              {/* Inputs que ocupam as duas colunas */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <p className="text-left mt-2 text-sm sm:text-base pl-1 text-white">
                  Telefone do morador
                </p>
                <Input
                  placeholder="Ex: (11) 99999-9999"
                  type="text"
                  className="w-full h-10 pl-3 text-sm sm:text-base"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col">
                <p className="text-left mt-2 text-sm sm:text-base pl-1 text-white">
                  Observações
                </p>
                <Input
                  placeholder="Ex: Entregar na portaria"
                  type="text"
                  className="w-full h-20 pl-3 text-sm sm:text-base"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-[#242A3A] p-3 rounded-2xl">
              <p className="text-left text-xs sm:text-sm text-[#9AA0B0]">
                Após o registro, um código QR Code será gerado para o morador
                retirar a encomenda na portaria.
              </p>
            </div>

            {/* Botão */}
            <div className="mt-6 w-full">
              <Button
                nome="Registrar Entrega"
                estilo="secundary"
                className="w-full text-white py-3 !text-base sm:!text-lg font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualRegisterPage;
