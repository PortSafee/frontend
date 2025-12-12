"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { IoSend } from "react-icons/io5";
import Icon_SafeBoot from "@/assets/icons/icon_safeboot.png";
import Image from "next/image";
import api from "@/config/api";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
    const router = useRouter();
    const [morador, setMorador] = useState<any>(null);

// Carrega o morador do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("morador");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setMorador(parsedUser);
    }
  }, []);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Olá! 👋 Sou a SafeBoot, sua assistente virtual para entregas seguras e inteligentes. Como posso ajudá-lo hoje?",
            sender: 'bot'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;
        setMessage("");

        // Adiciona mensagem do usuário
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setIsLoading(true);

        try {
            // Envia a mensagem para a API
            const response = await api.post('/api/Chatbot/perguntar', {
                mensagem: userMessage,
            });

            // Adiciona resposta do bot
            const botResponse = response.data?.resposta || 
                               response.data?.message || 
                               response.data?.Resposta ||
                               response.data?.Message ||
                               "Desculpe, não consegui processar sua pergunta.";
                               
            setMessages(prev => [...prev, {
                text: botResponse,
                sender: 'bot'
            }]);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            let errorMessage = "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.";
            
            if (axios.isAxiosError(error)) {
                console.error('Detalhes do erro:', error.response?.data);
                errorMessage = error.response?.data?.message || 
                             error.response?.data?.Message ||
                             error.response?.data?.erro ||
                             errorMessage;
            }
                               
            setMessages(prev => [...prev, {
                text: errorMessage,
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
            {/* Barra de navegação */}
            <NavBar
                    nome={morador?.nome || morador?.Nome || "Morador"}
                    funcao="Painel do Morador"
                    tipoUsuario="morador"
                    onSairClick={() => router.push("/General/LoginPage")}
                    onChatClick={() => router.push("/Resident/ChatBot")}
                  />

            {/* Container principal */}
            <div className="flex justify-center items-start px-4 sm:px-8 mt-10">
                <div className="w-full  bg-[#1F2430] rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col h-[75vh]">

                    {/* Cabeçalho do chat */}
                    <div className="flex items-center gap-4 border-b border-[#2E323C] pb-4 mb-4">
                        <div className="relative">
                            <div className="w-14 h-14 flex items-center justify-center">
                                <Image
                                    src={Icon_SafeBoot}
                                    alt="Safeboot"
                                    className="w-12 h-12 rounded-full"
                                    width={48}
                                    height={48}
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="title font-marmelad !text-xl font-semibold">Safeboot</h2>
                            <p className="text-sm text-[#ffffffd5]">Assistente Virtual • Sempre Disponível</p>
                        </div>
                    </div>

                    {/* Mensagem inicial */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && (
                                    <Image
                                        src={Icon_SafeBoot}
                                        alt="Safebot"
                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                        width={32}
                                        height={32}
                                    />
                                )}
                                <div className={`px-4 py-3 rounded-xl max-w-[80%] text-sm ${
                                    msg.sender === 'bot' 
                                        ? 'bg-[#2E323C] text-gray-200' 
                                        : 'bg-blue-600 text-white'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start space-x-2">
                                <Image
                                    src={Icon_SafeBoot}
                                    alt="Safebot"
                                    className="w-8 h-8 rounded-full"
                                    width={32}
                                    height={32}
                                />
                                <div className="bg-[#2E323C] px-4 py-3 rounded-xl text-sm text-gray-200">
                                    <span className="animate-pulse">Digitando...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Campo de mensagem */}
                    <div className="mt-4">
                        <div className="flex items-center bg-[#2E323C] rounded-xl px-4 py-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={isLoading || !message.trim()}
                                className="ml-2 p-2 bg-[#1F2430] border border-[#3A3F4A] rounded-lg hover:bg-[#2E323C] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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
