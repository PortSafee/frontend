"use client";

import React, { useEffect, useState } from "react";
import Logo from "@/assets/logo_portsafe.png";
import Button from "@/components/Button";
import { GoCheckCircle } from "react-icons/go";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface EntregaData {
  entregaId?: number;
  codigoEntrega?: string;
  numeroArmario?: number;
}

const DeliverySuccessPage: React.FC = () => {
  const router = useRouter();
  const [entrega, setEntrega] = useState<EntregaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dadosEntrega = localStorage.getItem("entregaAtual");
    if (!dadosEntrega) {
      router.push("/DeliveryPeople/RegisterDeliveryPage");
      return;
    }

    const parsed = JSON.parse(dadosEntrega);
    setEntrega(parsed);

    // Confirmar fechamento no backend
    const confirmarFechamento = async () => {
      try {
        await axios.post("http://localhost:5095/api/Entrega/ConfirmarFechamento", {
          entregaId: parsed.entregaId,
        });
      } catch (err) {
        console.error("Erro ao confirmar fechamento", err);
      } finally {
        setLoading(false);
      }
    };

    confirmarFechamento();
  }, [router]);

  if (loading || !entrega) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134]">
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
          <Image src={Logo} alt="Logo" width={320} height={320} className="w-80" />
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-1/2">
          <div className="bg-[#ffffff18] border-2 border-[#606060] rounded-2xl p-10">
            <h1 className="text-3xl text-white text-center">Finalizando entrega...</h1>
            <h3 className="text-white text-center mt-4">Por favor, aguarde um momento.</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
        <Image src={Logo} alt="Logo PortSafe" width={320} height={320} className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
        <p className="text-white text-lg sm:text-xl md:text-2xl">Sistema de Entregas do Condomínio</p>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 overflow-y-auto mt-6 mb-6">
        <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
            <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">Entrega Registrada!</h1>
            <h3 className="text-sm sm:text-base opacity-90">O morador foi notificado automaticamente</h3>
          </div>

          <div className="flex justify-center my-4">
            <div className="flex items-center justify-center bg-gradient-to-r from-[#1FC364] to-[#11BA7F] rounded-full w-18 h-18">
              <GoCheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          <p className="text-white text-sm sm:text-base font-bold">Pacote Depositado com Sucesso!</p>
          <p className="text-white text-xs sm:text-sm opacity-80 mt-1">
            O sensor confirmou que a encomenda foi colocada no armário
          </p>

          <div className="px-6 py-4 bg-[#0cafd831] border-2 border-[#0CB0D8] rounded-2xl mx-6 mt-4">
            <p className="text-white font-normal text-xs">CODIGO DE ENTREGA</p>
            <p className="text-white text-4xl sm:text-5xl font-bold mt-1">{entrega.codigoEntrega}</p>
          </div>

          <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff18] rounded-2xl m-6 mt-6 p-4 border-2 border-[#606060]">
            <p className="text-left text-sm sm:text-base text-white font-bold">Detalhes da Entrega</p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm sm:text-base font-thin text-white">Armário:</p>
              <p className="text-sm sm:text-base font-bold text-white">{entrega.numeroArmario}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm sm:text-base font-thin text-white">Código de Retirada:</p>
              <p className="text-sm sm:text-base font-bold text-white">{entrega.codigoEntrega}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm sm:text-base font-thin text-white">Status:</p>
              <p className="text-sm sm:text-base font-bold text-[#1FC364]">Armazenada</p>
            </div>
          </div>

          <p className="text-[#FFFFFF] font-bold text-base mb-2 text-left ml-10">Notificações Enviadas</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pl-6 pr-6">
            <div className="bg-[#1fc36325] border-1 border-[#1FC364] text-white font-bold py-2 px-3 rounded-lg text-sm">
              WhatsApp
              <p className="mt-5 font-extralight text-sm">Mensagem enviada com o código de retirada</p>
            </div>
            <div className="bg-[#0cafd82a] border-1 border-[#0CB0D8] text-white font-bold py-2 px-3 rounded-lg text-sm">
              App do Condomínio
              <p className="mt-8 font-extralight text-sm">Notificação enviada ao morador</p>
            </div>
            <div className="bg-[#f77a1425] border-1 border-[#F77B14] text-white font-bold py-2 px-3 rounded-lg text-sm">
              QR Code gerado
              <p className="mt-1 font-extralight text-sm">O morador pode escanear o código enviado ou usar a senha numérica para retirar a encomenda</p>
            </div>
          </div>

          <Button 
          nome="Finalizar e Voltar ao Início"
          estilo="primary"
          className="!w-full text-white text-xs sm:text-sm mt-6 mb-2 ml-6 mr-6"
          clique={router.push.bind(router, "/General/SelectProfilePage")}
          />

          <Button
            nome="Registrar Nova Entrega"
            estilo="transparent"
            className="!w-full text-white text-xs sm:text-sm mb-6 ml-6 mr-6 !bg-transparent"
            clique={() => {
              localStorage.clear();
              router.push("/DeliveryPeople/RegisterDeliveryPage");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliverySuccessPage;