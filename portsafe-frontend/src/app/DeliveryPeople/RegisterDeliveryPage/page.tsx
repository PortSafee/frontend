"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import BackButton from "@/components/BackButton";
import Logo from "@/assets/logo_portsafe.png";
import { useRouter } from "next/navigation";
import { BsPeople } from "react-icons/bs";
import axios from "axios";

/*Definir Interfaces TypeScript para Payload e Resposta*/
interface ValidarDestinatarioRequest {
  NomeDestinatario: string;
  TipoUnidade: string;
  CEP?: string;
  Torre?: string;
  Numero?: string;
}

interface ValidacaoDestinatarioResponse {
  validado: boolean;
  mensagem: string;
  tipoResultado:
  | "Sucesso"
  | "DivergenciaNome"
  | "DivergenciaCEP"
  | "NaoEncontrado"
  | "MultiplasCombinacoes";

  dadosEncontrados?: {
    nomeMorador?: string;
    telefoneWhatsApp?: string;
    tipoUnidade?: string;
    endereco?: string;
    cep?: string;
    unidadeId: number;
    moradorId: number;
  };

  podeRetentar: boolean;
  podeAcionarPortaria: boolean;
  tokenValidacao?: string;
  validacaoId?: number;
}


const RegisterDeliveryPage: React.FC = () => {
  const [tipoUnidade, setTipoUnidade] = useState(""); // ← CASA | APARTAMENTO
  const [tipoEntrega, setTipoEntrega] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [torre, setTorre] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [podeRetentar, setPodeRetentar] = useState(false);
  const [podeAcionarPortaria, setPodeAcionarPortaria] = useState(false);
  const router = useRouter();



  const onSubmit = async () => {
    // Valida campos obrigatórios conforme tipo selecionado
    if (!destinatario.trim() || !tipoUnidade) {
      setErrorMessage("Preencha o nome e selecione Casa ou Apartamento.");
      return;
    }

    if (tipoUnidade === "Casa" && !cep.trim()) {
      setErrorMessage("Digite o CEP da Casa.");
      return;
    }

    if (tipoUnidade === "Apartamento") {
      if (!torre.trim() || !numero.trim()) {
        setErrorMessage("Digite Torre/Bloco e Número do Apartamento.");
        return;
      }
    }


    if (!tipoEntrega) {
      setErrorMessage("Selecione o Tipo de Entrega.");
      return;
    }

    const cepLimpo = cep.replace(/\D/g, "");
    if (tipoUnidade === "Casa" && cepLimpo.length !== 8) {
      setErrorMessage("CEP inválido. Deve ter 8 dígitos.");
      return;
    }


    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setPodeRetentar(false);
    setPodeAcionarPortaria(false);

    try {
      const requestData: ValidarDestinatarioRequest = {
        NomeDestinatario: destinatario,
        TipoUnidade: tipoUnidade,
        ...(tipoUnidade === "Casa" ? { CEP: cepLimpo } : {}),
        ...(tipoUnidade === "Apartamento" ? { Torre: torre, Numero: numero } : {}),
      };

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5095";

      const response = await axios.post<ValidacaoDestinatarioResponse>(
        `${backendUrl}/api/Entrega/ValidarDestinatario`,
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

     if (data.validado) {
  setSuccessMessage(data.mensagem);

  // Salva TODOS os dados necessários para os próximos passos
  if (data.dadosEncontrados) {
    localStorage.setItem("validatedDeliveryData", JSON.stringify(data.dadosEncontrados));
  }
  
  // ESSAS DUAS LINHAS SÃO OBRIGATÓRIAS!
  localStorage.setItem("tokenValidacao", data.tokenValidacao || "");
  localStorage.setItem("validacaoId", data.validacaoId?.toString() || "");

  setTimeout(() => {
    router.push("/DeliveryPeople/AddressConfirmationPage");
  }, 1000);
} else {
        setErrorMessage(data.mensagem);
        setPodeRetentar(data.podeRetentar);
        setPodeAcionarPortaria(data.podeAcionarPortaria);
      }
    } catch (error: any) {
      console.error("Erro na validação:", error);
      setErrorMessage(error.response?.data?.message || "Erro ao validar destinatário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
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
        {/* Lado direito - Carregamento */}
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
          {/* Card de carregamento */}
          <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden p-4">
            {/* Cabeçalho */}
            <div className="flex flex-col items-center justify-center text-white">
              <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1 mt-4">
                Validando Endereço...
              </h1>
              <h3 className="text-sm sm:text-base opacity-90">
                Verificando dados no sistema..
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
                  {destinatario || "João Silva"}
                </p>
              </div>
              {/* Linha 2 - Apartamento */}
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm sm:text-base font-thin text-white">
                  Apartamento:
                </p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {apartamento || "1205, Bloco A - Apt 804"}
                </p>
              </div>
            </div>
            {/* Spinner e instruções */}
            <div className="flex flex-col items-center justify-center mt-4">
              <div className="w-16 h-16 border-4 border-t-4 border-t-[#00C2FF] border-[#00C2FF]/30 rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg mb-2">Validando dados com o sistema...</p>
              <p className="text-gray-400 text-sm">Isso pode levar alguns segundos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }




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
            <p>Passo 1 de 4</p>
            <p>25%</p>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full">
            <div className="h-3 bg-gradient-to-r from-[#00C2FF] to-[#007BFF] rounded-full w-1/4"></div>
          </div>
        </div>


        {/* Card de registro */}
        <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
          {/* Cabeçalho do card */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
            <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">
              Registrar Entrega
            </h1>
            <h3 className="text-sm sm:text-base opacity-90">
              Preencha os dados do destinatário
            </h3>
          </div>
          {/* Inputs */}
          <div className="px-4 sm:px-8 md:px-10">
            <p className="text-left mt-4 text-sm sm:text-base pl-3 text-white">
              Nome do Destinatário / Morador
            </p>
            <Input
              placeholder="Ex: João Silva"
              type="text"
              className="!w-135 max-w-full h-8 pl-4"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
            />

            {/* CASA / APARTAMENTO */}
            <p className="text-left mt-4 pl-3 text-white">Tipo de Unidade</p>

            <select
              className="w-full h-8 bg-[#333B40] text-white rounded-2xl px-2 
             border border-[#ffffff26]"
              value={tipoUnidade}
              onChange={(e) => {
                setTipoUnidade(e.target.value);
                setCep("");
                setApartamento("");
              }}
            >
              <option value="">Selecione</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
            </select>

            {/* CEP (CASA) */}
            {tipoUnidade === "Casa" && (
              <>
                <p className="text-left mt-4 text-white">CEP da Casa</p>
                <Input
                  placeholder="Digite o CEP"
                  value={cep}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
                    setCep(v.slice(0, 9));
                  }}
                  className="!w-full h-8 pl-4"
                />
              </>
            )}

            {/* APTO (APARTAMENTO) */}
            {tipoUnidade === "Apartamento" && (
              <>
                <p className="text-left mt-4 text-white">Torre / Bloco</p>
                <Input
                  placeholder="Ex: Bloco A"
                  value={torre}
                  onChange={(e) => setTorre(e.target.value)}
                  className="!w-full h-8 pl-4"
                />

                <p className="text-left mt-4 text-white">Número do Apartamento</p>
                <Input
                  placeholder="Ex: 804"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="!w-full h-8 pl-4"
                />
              </>
            )}

          </div>

          {/* Tipo de Entrega */}
          <p className="flex flex-wrap text-left mt-4 mb-1 text-sm sm:text-base pl-4 sm:pl-12 text-white">
            Tipo de Entrega
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 sm:gap-5 mb-6 px-4 sm:px-8">
            {/* Entrega Padrão */}
            <div
              onClick={() => setTipoEntrega("Padrão")}
              className={`cursor-pointer p-3 sm:p-4 md:p-5 rounded-xl border w-full sm:w-auto max-w-[240px] mx-auto ${tipoEntrega === "Padrão"
                ? "border-[#0CB0D8] bg-[#ffffff26]"
                : "border-transparent bg-[#ffffff26]"
                } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#00E096] rounded-full mx-auto mb-2 sm:mb-3"></div>
              <p className="text-gray-100 text-sm sm:text-base md:text-lg font-bold text-center">
                Padrão
              </p>
              <p className="text-gray-400 text-[0.7rem] sm:text-xs md:text-sm leading-snug text-center">
                Encomendas, correspondências e documentos
              </p>
            </div>
            {/* Entrega Perecível */}
            <div
              onClick={() => setTipoEntrega("Perecível")}
              className={`cursor-pointer p-3 sm:p-4 md:p-5 rounded-xl border w-full sm:w-auto max-w-[240px] mx-auto ${tipoEntrega === "Perecível"
                ? "border-[#0CB0D8] bg-[#ffffff26]"
                : "border-transparent bg-[#ffffff26]"
                } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#0CB0D8] rounded-full mx-auto mb-2 sm:mb-3"></div>
              <p className="text-gray-100 text-sm sm:text-base md:text-lg font-bold text-center">
                Perecível
              </p>
              <p className="text-gray-400 text-[0.7rem] sm:text-xs md:text-sm leading-snug text-center">
                Alimentos e/ou produtos refrigerados
              </p>
            </div>
            {/* Entrega Volumosa */}
            <div
              onClick={() => setTipoEntrega("Volumosa")}
              className={`cursor-pointer p-3 sm:p-4 md:p-5 rounded-xl border w-full sm:w-auto max-w-[240px] mx-auto ${tipoEntrega === "Volumosa"
                ? "border-[#0CB0D8] bg-[#ffffff26]"
                : "border-transparent bg-[#ffffff26]"
                } hover:bg-[#01384D]/70 transition`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#F77B14] rounded-full mx-auto mb-2 sm:mb-3"></div>
              <p className="text-gray-100 text-sm sm:text-base md:text-lg font-bold text-center">
                Volumosa
              </p>
              <p className="text-gray-400 text-[0.7rem] sm:text-xs md:text-sm leading-snug text-center">
                Pacotes grandes que não cabem no armário
              </p>
            </div>

            
          </div>
          {/* Modal */}
          {(tipoEntrega === "Volumosa" || tipoEntrega === "Perecível") && (
            <>
              <div className="fixed inset-0 bg-[#2258847d] bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-r from-[#000000] to-[#061f34] rounded-xl p-6 w-[35vw] text-center">
                  <h3 className="title font-marmelad !text-3xl font-bold text-[#E9D9AE] mt-4 mb-4">Atenção!</h3>
                  <p className="text-gray-300 text-xl mb-6">Para esse tipo de encomenda é necessário se dirigir à portaria!</p>
                  <Button
                    nome="Entendi"
                    estilo="secundary"
                    className="w-full text-white"
                    clique={() => setTipoEntrega("")}
                  />
                </div>
              </div>
            </>
          )}
          {errorMessage && ( <p className="ml-8 mr-8 mb-2 bg-[#c31f1f43] text-white p-1 rounded">{errorMessage}</p> )} 
          {successMessage && ( <p className="ml-8 mr-8 mb-2 bg-[#1fc36343] text-white p-1 rounded">{successMessage}</p> )}

          
         
          {/* Botões condicionais para opções de erro */}
          {(podeRetentar || podeAcionarPortaria) && (
  <div className="flex justify-center gap-4 px-4 sm:px-6 mb-4">
    {podeRetentar && (
      <Button
        nome="Tentar Novamente"
        estilo="secundary"
        className="flex-1 text-white"
        clique={() => {
          setDestinatario("");
          setApartamento("");
          setCep("");
          setErrorMessage("");
          setPodeRetentar(false);
        }}
      />
    )}
    {podeAcionarPortaria && (
      <Button
        nome="Acionar Portaria"
        estilo="secundary"
        className="flex-1 text-white"
        clique={() => {
          alert("Dirija-se à portaria para assistência.");
        }}
      />
    )}
  </div>
)}

          {/* Botão */}
          <div className="flex justify-center px-4 sm:px-6 mb-8">
            <Button
              nome="Confirmar e Continuar"
              estilo="primary"
              className="!w-133 max-w-full text-white text-xs sm:text-sm md:text-base"
              clique={onSubmit}
            />
          </div>
        </div>
      <BackButton className="mt-4 font-normal" />
      </div>
    </div>
  );
};

export default RegisterDeliveryPage;