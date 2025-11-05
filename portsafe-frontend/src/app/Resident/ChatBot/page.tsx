"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { IoSend } from "react-icons/io5";
import Icon_SafeBoot from "@/assets/icons/icon_safeboot.png";

const ChatBot: React.FC = () => {
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
            {/* Barra de navegação */}
            <NavBar nome="João Silva" funcao="Painel do Morador" tipoUsuario="morador" />

            {/* Container principal */}
            <div className="flex justify-center items-start px-4 sm:px-8 mt-10">
                <div className="w-full  bg-[#1F2430] rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col h-[75vh]">

                    {/* Cabeçalho do chat */}
                    <div className="flex items-center gap-4 border-b border-[#2E323C] pb-4 mb-4">
                        <div className="relative">
                            <div className="w-14 h-14 flex items-center justify-center">
                                <img
                                    src={Icon_SafeBoot.src}
                                    alt="Safeboot"
                                    className="w-12 h-12 rounded-full"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="title font-marmelad !text-xl font-semibold">Safeboot</h2>
                            <p className="text-sm text-[#ffffffd5]">Assistente Virtual • Sempre Disponível</p>
                        </div>
                    </div>

                    {/* Mensagem inicial */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex items-start space-x-2">
                            <img
                                src={Icon_SafeBoot.src}
                                alt="Safebot"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="bg-[#2E323C] px-4 py-3 rounded-xl max-w-[80%] text-sm text-gray-200">
                                Olá! 👋 Sou a SafeBoot, sua assistente virtual para entregas seguras e
                                inteligentes. Como posso ajudá-lo hoje?
                            </div>
                        </div>
                    </div>

                    {/* Campo de mensagem */}
                    <div className="mt-4">
                        <div className="flex items-center bg-[#2E323C] rounded-xl px-4 py-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
                            />
                            <button className="ml-2 p-2 bg-[#1F2430] border border-[#3A3F4A] rounded-lg hover:bg-[#2E323C] transition">
                                <IoSend size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChatBot;
