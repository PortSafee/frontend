"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Logo from "@/assets/logo_portsafe.png";
import { BsPeople } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";

interface DadosValidados {
    nomeMorador: string;
    telefoneWhatsApp?: string;
  tipoUnidade: string;
  endereco: string;
  cep?: string;
  unidadeId: number;
  moradorId: number;
}

const AddressConfirmationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [dadosValidados, setDadosValidados] = useState<DadosValidados | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDadosFromStorage = () => {
      const storedData = localStorage.getItem("validatedDeliveryData");

      if (!storedData) {
        setErrorMessage("Dados de validação não encontrados. Volte e valide novamente.");
        setLoading(false);
        return;
      }

      try {
        const parsedData: DadosValidados = JSON.parse(storedData);
        setDadosValidados(parsedData);
      } catch (error) {
        console.error("Erro ao parsear dados do storage:", error);
        setErrorMessage("Erro ao carregar dados validados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDadosFromStorage();
  }, []);

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
        {/* Lado esquerdo - Logo e nome */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
          <Image src={Logo} alt="Logo PortSafe" className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
          <p className="text-white text-lg sm:text-xl md:text-2xl">Sistema de Entregas do Condomínio</p>
        </div>

        {/* Lado direito - Conteúdo */}
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

          {/* Card de loading */}
          <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
            <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
              <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">Carregando Endereço...</h1>
              <h3 className="text-sm sm:text-base opacity-90">Validando informações</h3>
            </div>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00C2FF]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !dadosValidados) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
        {/* Lado esquerdo - Logo e nome */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
          <Image src={Logo} alt="Logo PortSafe" className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
          <p className="text-white text-lg sm:text-xl md:text-2xl">Sistema de Entregas do Condomínio</p>
        </div>

        {/* Lado direito - Conteúdo com erro */}
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

          {/* Card com erro */}
          <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden p-6">
            <p className="ml-8 mr-8 mb-2 bg-[#c31f1f43] text-white p-1 rounded">{errorMessage || "Dados não encontrados."}</p>
            <Button
              nome="Voltar e Tentar Novamente"
              estilo="secundary"
              className="w-full text-white"
              clique={() => {
                localStorage.removeItem("validatedDeliveryData"); // Limpa para retry
                handleRedirect("/DeliveryPeople/RegisterDeliveryPage");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
      {/* Lado esquerdo - Logo e nome */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
        <Image src={Logo} alt="Logo PortSafe" className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
        <p className="text-white text-lg sm:text-xl md:text-2xl">Sistema de Entregas do Condomínio</p>
      </div>

      {/* Lado direito - Conteúdo */}
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

        {/* Card principal */}
        <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
          {/* Cabeçalho do card */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
            <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">Endereço Validado!</h1>
            <h3 className="text-sm sm:text-base opacity-90">Confira os dados e confirme</h3>
          </div>

          {/* Destinatário */}
          <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff18] rounded-2xl m-6 mt-6 p-4 border-2 border-[#606060]">
            <p className="text-left text-sm sm:text-base text-white font-bold flex items-center">
              <BsPeople className="inline-block mr-2 text-xl text-[#0CB0D8]" />
              Destinatário da Entrega
            </p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm sm:text-base font-thin text-white">Nome:</p>
              <p className="text-sm sm:text-base font-bold text-white">{dadosValidados.nomeMorador}</p>
            </div>
            {dadosValidados.telefoneWhatsApp && (
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm sm:text-base font-thin text-white">Telefone:</p>
                <p className="text-sm sm:text-base font-bold text-white">{dadosValidados.telefoneWhatsApp}</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm sm:text-base font-thin text-white">Tipo Unidade:</p>
              <p className="text-sm sm:text-base font-bold text-white">{dadosValidados.tipoUnidade}</p>
            </div>
          </div>

          {/* Endereço */}
          <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-6 p-4 border-2 border-[#1FC364]">
            <p className="text-left text-sm sm:text-base text-white font-bold flex items-center">
              <CiLocationOn className="inline-block mr-2 text-xl text-[#1FC364]" />
              Endereço
            </p>
            <div className="flex items-center mt-4">
              <p className="text-sm sm:text-base font-thin text-white">{dadosValidados.endereco}</p>
            </div>
            {dadosValidados.cep && (
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm sm:text-base font-thin text-white">CEP: {dadosValidados.cep}</p>
              </div>
            )}
            <div className="bg-[#1fc364] text-white font-bold h-auto min-h-[1vh] w-fit min-w-[12vw] px-4 rounded-2xl mt-2 border-2 border-[#1FC364] flex items-center justify-center text-center">
              Validado no Sistema
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col justify-center px-4 sm:px-6 mb-6">
            <Button
              nome="Confirmar e Continuar"
              estilo="primary"
              className="!w-133 max-w-full text-white text-xs sm:text-sm md:text-base mb-4"
              clique={() => {
                setLoading(true);
                // Mantenha dados no storage para próximos passos se necessário
                setTimeout(() => {
                  router.push("/DeliveryPeople/DeliveryInstructionsPage");
                }, 1000);
              }}
            />
            <Button
              nome="Redigitar Dados"
              estilo="transparent"
              className="!w-133 max-w-full text-white !bg-[#00000000] text-xs sm:text-sm md:text-base"
              clique={() => {
                localStorage.removeItem("validatedDeliveryData"); // Limpa para retry
                handleRedirect("/DeliveryPeople/RegisterDeliveryPage");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressConfirmationPage;