"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/assets/logo_portsafe.png";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ArmarioResponse {
  sucesso: boolean;
  mensagem: string;
  numeroArmario?: number;
  codigoEntrega?: string;
  entregaId?: number;
  limiteDeposito?: string;
}

const DeliveryInstructionsPage: React.FC = () => {
  const router = useRouter();
  const [armarioData, setArmarioData] = useState<ArmarioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Pega os dados validados da página anterior
  useEffect(() => {
  const validatedData = localStorage.getItem("validatedDeliveryData");
  const tokenValidacao = localStorage.getItem("tokenValidacao");

  if (!validatedData || !tokenValidacao) {
    setError("Dados de validação perdidos. Volte ao início.");
    setLoading(false);
    return;
  }

  const solicitarArmario = async () => {
    try {
      const parsed = JSON.parse(validatedData);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5095";

      const response = await axios.post<ArmarioResponse>(
        `${backendUrl}/api/Entrega/SolicitarArmario`,
        {
          tokenValidacao: tokenValidacao,        // ← ESSENCIAL
          unidadeId: parsed.unidadeId,           // ← ESSENCIAL
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.sucesso) {
        setArmarioData(response.data);
        localStorage.setItem("entregaAtual", JSON.stringify(response.data));
      } else {
        setError(response.data.mensagem || "Nenhum armário disponível.");
      }
    } catch (err: any) {
      console.error("Erro completo:", err.response || err);
      const msg = err.response?.data?.mensagem || err.response?.data?.Message || "Erro ao reservar armário";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  solicitarArmario();
}, [router]);

  // Timer de 5 minutos
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimeoutModal(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134]">
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
          <img src={Logo.src} alt="Logo PortSafe" className="w-60 md:w-80 mb-2" />
          <p className="text-white text-xl">Sistema de Entregas do Condomínio</p>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-1/2">
          <div className="bg-[#ffffff18] border-2 border-[#606060] rounded-2xl p-10 text-center">
            <h1 className="title font-marmelad text-3xl text-white mb-4">Reservando armário...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#00C2FF] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !armarioData?.numeroArmario) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134]">
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
          <img src={Logo.src} alt="Logo PortSafe" className="w-60 md:w-80 mb-2" />
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-1/2">
          <div className="bg-[#ffffff18] border-2 border-[#606060] rounded-2xl p-10 text-center max-w-md">
            <h2 className="text-2xl text-red-400 mb-4">Erro</h2>
            <p className="text-white mb-6">{error || "Nenhum armário disponível no momento."}</p>
            <Button nome="Voltar" estilo="primary" clique={() => router.push("/DeliveryPeople/RegisterDeliveryPage")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
        {/* Lado esquerdo - Logo */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
          <img src={Logo.src} alt="Logo PortSafe" className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
          <p className="text-white text-lg sm:text-xl md:text-2xl">Sistema de Entregas do Condomínio</p>
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
            <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
              <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">Armário Liberado!</h1>
              <h3 className="text-sm sm:text-base opacity-90">Deposite a encomenda agora</h3>
            </div>

            {/* Armário Designado */}
            <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-6 p-4 border-2 border-[#1FC364]">
              <p className="text-center text-sm sm:text-base text-white font-bold">ARMÁRIO DESIGNADO</p>
              <p className="text-5xl font-bold text-white mt-2">{armarioData.numeroArmario}</p>
              <div className="inline-flex items-center bg-[#1FC364] text-white font-semibold py-1 px-2 w-auto rounded-md mt-2 mb-2">
                Aberto - Aguardando Depósito
              </div>
            </div>

            {/* Tempo Restante */}
            <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff17] rounded-2xl m-6 mt-6 p-2 border-2 border-[#606060]">
              <p className="text-center text-sm sm:text-base text-white font-extralight">Tempo restante para depósito</p>
              <div className="inline-flex items-center text-3xl text-[#F77B14] font-bold py-1 px-2 w-auto rounded-md mt-1">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Instruções */}
            <div className="px-4 sm:px-8 md:px-4 bg-[#1fc3631b] rounded-2xl m-6 mt-0 p-4 border-2 border-[#1FC364]">
              <p className="text-left text-sm sm:text-base text-[#83EAAA]">Instruções:</p>
              <ol className="text-left text-sm sm:text-base text-[#83EAAA] space-y-1">
                <li>1. Localize o armário {armarioData.numeroArmario}</li>
                <li>2. Abra a porta (já está destrancada)</li>
                <li>3. Coloque a encomenda dentro</li>
                <li>4. Feche a porta completamente</li>
                <li>5. Clique em "Confirmar Depósito"</li>
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
                clique={() => router.push("/DeliveryPeople/DeliverySuccessPage")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de tempo esgotado */}
      {showTimeoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-black rounded-lg p-6 shadow-lg max-w-sm w-full border border-orange-500">
            <h2 className="text-yellow-300 text-3xl font-bold text-center mb-4">Atenção!</h2>
            <p className="text-white text-center mb-6">Tempo esgotado! Dirija-se à portaria.</p>
            <Button
              nome="Entendido"
              estilo="primary"
              clique={() => router.push("/DeliveryPeople/RegisterDeliveryPage")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryInstructionsPage;