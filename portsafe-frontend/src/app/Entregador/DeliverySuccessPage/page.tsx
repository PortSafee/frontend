"use client";

import React from "react";
import Logo from "@/assets/logo_portsafe.png";
import Button from "@/components/Button";
import { GoCheckCircle } from "react-icons/go";

// Exemplo com valor temporário
const codentrega = "L040UXQX";
const armario = "015";
const status = "Aguardando Retirada"

const DeliverySuccessPage: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
            {/* Lado esquerdo - Logo e nome */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
                <img src={Logo.src} alt="Logo PortSafe" className="w-50 sm:w-60 md:w-80 mb-2 max-w-full" />
                <p className="text-white text-lg sm:text-xl md:text-2xl">
                    Sistema de Entregas do Condomínio
                </p>
            </div>

            {/* Lado direito - Conteúdo */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 overflow-y-auto mt-6 mb-6">
                {/* Card principal */}
                <div className="bg-[#ffffff18] border-2 border-[#606060] mr-0 md:mr-16 rounded-2xl w-150 max-w-full text-center shadow-lg overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#084571] text-white">
                        <h1 className="title font-marmelad !text-2xl sm:!text-3xl mb-1">
                            Entrega Registrada!
                        </h1>
                        <h3 className="text-sm sm:text-base opacity-90">
                            O morador foi notificado automaticamente
                        </h3>
                    </div>

                    {/* Ícone de sucesso*/}
                    <div className="flex justify-center my-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-[#1FC364] to-[#11BA7F] rounded-full w-18 h-18">
                            <GoCheckCircle className="w-16 h-16 text-white" />
                        </div>
                    </div>


                    {/* Mensagem de sucesso */}
                    <p className="text-white text-sm sm:text-base font-bold">
                        Pacote Depositado com Sucesso!
                    </p>
                    <p className="text-white text-xs sm:text-sm opacity-80 mt-1">
                       O sensor confirmou que a encomenda foi colocada no armário
                    </p>


                    {/* Código da entrega */}
                    <div className="px-6 py-4 bg-[#0cafd831] border-2 border-[#0CB0D8] rounded-2xl mx-6 mt-4">
                        <p className="text-white font-semibold text-xs ">Código da Entrega</p>
                        <p className="text-white text-3xl sm:text-4xl font-bold mt-1">{codentrega}</p>
                    </div>

                    {/* Detalhes da entrega */}
                    {/* Dados da Entrega */}
                                        <div className="px-4 sm:px-8 md:px-4 bg-[#ffffff18] rounded-2xl m-6 mt-6 p-4 border-2 border-[#606060]">
                                            <p className="text-left text-sm sm:text-base text-white font-bold flex items-center">
                                               
                                                Detalhes da Entrega
                                            </p>
                    
                                            {/* Linha 1 - Armário */}
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-sm sm:text-base font-thin text-white">
                                                    Armário:
                                                </p>
                                                <p className="text-sm sm:text-base font-bold text-white">
                                                    {armario}
                                                </p>
                                            </div>
                    
                                            {/* Linha 2 - Código */}
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-sm sm:text-base font-thin text-white">
                                                    Código De Rastreio:
                                                </p>
                                                <p className="text-sm sm:text-base font-bold text-white">
                                                    {codentrega}
                                                </p>
                                            </div>

                                            {/* Linha 3 - Statis */}
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-sm sm:text-base font-thin text-white">
                                                    Status:
                                                </p>
                                                <p className="text-sm sm:text-base font-bold text-[#AFA81D]">
                                                    {status}
                                                </p>
                                            </div>
                                        </div>

                    {/* Notificações enviadas */}

                    <p className="text-[#FFFFFF] font-bold text-base mb-2 text-left ml-10">Notificações Enviadas</p>

                    
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pl-6 pr-6">
                            <div className="bg-[#1fc36325] border-1 border-[#1FC364] text-white font-bold py-2 px-3 rounded-lg text-sm">
                                WhatsApp
                                <p className="mt-1 font-extralight text-sm">Mensagem enviada com o código de retirada</p>
                            </div>
                            <div className="bg-[#0cafd82a] border-1 border-[#0CB0D8] text-white font-bold py-2 px-3 rounded-lg text-sm">
                                App do Condomínio
                                <p className="mt-1 font-extralight text-sm">Notificação enviada ao morador</p>
                            </div>
                            <div className="bg-[#f77a1425] border-1 border-[#F77B14] text-white font-bold py-2 px-3 rounded-lg text-sm">
                                QR Code gerado
                                <p className="mt-1 font-extralight text-sm">O morador pode escanear o código enviado ou usar a senha numérica</p>
                            </div>
                        </div>

                    {/* Botões */}
                   
                        <Button
                            nome="Finalizar e Voltar ao Início"
                            estilo="primary"
                            className="!w-full text-white text-xs sm:text-sm mt-4 ml-6 mr-6"
                        />
                        <Button
                            nome="Registrar Nova Entrega"
                            estilo="transparent"
                            className="!w-full !bg-[#00000000] text-white text-xs sm:text-sm mt-4 mb-4 ml-6 mr-6"
                        />
                </div>
            </div>
        </div>
    );
};

export default DeliverySuccessPage;