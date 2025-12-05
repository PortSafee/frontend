"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { FiAlertTriangle, FiBox } from "react-icons/fi";
import { IoPeople, IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResidentDashboard: React.FC = () => {
    const router = useRouter();
    const [showProfile, setShowProfile] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [entregas, setEntregas] = useState<any[]>([]);
    const [morador, setMorador] = useState<any>(null);
    const [historico, setHistorico] = useState<any[]>([]);


    useEffect(() => {
        const storedUser = localStorage.getItem("morador");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setMorador(parsedUser);   // <<< salva o morador para usar na tela
        }
    }, []);


    // Carrega morador e entregas
   // Carrega morador e entregas
useEffect(() => {
    const moradorId = morador?.id || morador?.Id;
    if (!moradorId) return;

    const carregarEntregas = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5095/api/Entrega/PorMoradorId?id=${moradorId}`
            );

            const lista = response.data;

            // separa entregas e histórico de verdade
            const ativas = lista.filter((e: any) => e.status !== "Retirada");
            const historicoDb = lista.filter((e: any) => e.status === "Retirada");

            setEntregas(ativas);
            setHistorico(historicoDb);

        } catch (error) {
            console.error("Erro ao carregar entregas:", error);
        }
    };

    carregarEntregas();
}, [morador]);



    const confirmarRetirada = async (id: number) => {
    try {
        await axios.put(`http://localhost:5095/api/Entrega/ConfirmarRetirada?entregaId=${id}`);

        // Atualiza localmente sem precisar refazer o GET
        setEntregas(prev => {
            const entregaConfirmada = prev.find(e => e.id === id);

            if (entregaConfirmada) {
                entregaConfirmada.status = "Retirada";
                entregaConfirmada.dataHoraRetirada = new Date().toISOString();

                setHistorico(h => [...h, entregaConfirmada]);
            }

            return prev.filter(e => e.id !== id);
        });

        alert("Entrega confirmada como retirada!");
    } catch (error) {
        console.error("Erro ao confirmar retirada:", error);
    }
};




    const entregasHoje = entregas.filter((e) => {
        const entregaDate = new Date(e.dataHoraRegistro);
        const today = new Date();
        return (
            entregaDate.getDate() === today.getDate() &&
            entregaDate.getMonth() === today.getMonth() &&
            entregaDate.getFullYear() === today.getFullYear()
        );
    });

    const entregasAguardando = entregas.filter(
        (e) =>
            e.status === "Na portaria" || e.status === "No armário" // ajuste conforme seu backend
    );

    const entregasMes = entregas.filter((e) => {
        const entregaDate = new Date(e.dataHoraRegistro);
        const today = new Date();
        return (
            entregaDate.getMonth() === today.getMonth() &&
            entregaDate.getFullYear() === today.getFullYear()
        );
    });


    return (
        <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
            <NavBar
                nome={morador?.nome || morador?.Nome || "Morador"}
                funcao="Painel do Morador"
                tipoUsuario="morador"
                onSairClick={() => router.push("/General/LoginPage")} 
                onChatClick={() => router.push("/Resident/ChatBot")}
                />

            <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
                <button
                    onClick={() => setShowProfile(true)}
                    className="lg:hidden bg-[#2A2F3B] border border-[#012032] rounded-2xl p-3 mb-4 flex items-center justify-center"
                >
                    <FaUser className="w-6 h-6 text-white" />
                </button>

                <div className="hidden lg:block lg:w-80 mx-auto lg:mx-0">
                    <MyProfile
                        nome={morador?.nome || morador?.Nome}
                        cargo="Morador"
                        apartamento={morador?.apartamento || morador?.Apartamento}
                        condominio={morador?.condominio || morador?.Condominio}
                        status={morador?.status || morador?.Status}
                        tipoUsuario="morador"
                    />
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 sm:p-6 flex items-start justify-between min-h-[150px]">
                            <div className="flex flex-col">
                                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2">Entregas Hoje</h3>
                                <p className="title font-marmelad text-3xl sm:text-4xl font-bold">{entregasHoje.length}</p>
                                <p className="text-xs sm:text-sm text-[#4ADD80] mt-2 sm:mt-3">
                                    {entregasHoje.length > 0 ? "+12% desde ontem" : "Nenhuma entrega hoje"}
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2 text-white">Aguardando Retirada</h3>
                                <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white">{entregasAguardando.length}</p>
                                <p className="text-xs sm:text-sm text-[#DBDB5A] mt-2 sm:mt-3">Na portaria/No armário</p>
                            </div>

                            <div className="flex flex-col">
                                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2 text-white">Total do Mês</h3>
                                <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white">{entregasMes.length}</p>
                                <p className="text-xs sm:text-sm text-[#4ADD80] mt-2 sm:mt-3">Entregas Recebidas</p>
                            </div>

                        </div>
                    </div>

                    {/*Toggle Button*/}

                    <div className="bg-[#2E323C] p-2 rounded-2xl w-fit flex items-center">
                        <button
                            onClick={() => setIsActive(true)}
                            className={`px-5 py-1.5 text-white font-medium text-sm sm:text-base rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-[#328BF1] to-[#0EAED9] shadow-md'
                                : 'bg-transparent'
                                }`}
                        >
                            Entregas Ativas
                        </button>
                        <button
                            onClick={() => setIsActive(false)}
                            className={`px-5 py-1.5 text-white font-medium text-sm sm:text-base rounded-2xl transition-all duration-300 ${!isActive
                                ? 'bg-gradient-to-r from-[#328BF1] to-[#0EAED9] shadow-md'
                                : 'bg-transparent'
                                }`}
                        >
                            Histórico
                        </button>
                    </div>


                    {/* Lista de entregas */}
                    <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl mt-6 sm:-mt-1 p-4 sm:p-6 space-y-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
                        {isActive ? (
                            <>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-2">
                                    <div>
                                        <h2 className="title font-marmelad !text-lg sm:!text-2xl font-semibold text-white">
                                            Entregas Ativas
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            Monitore todas as entregas do condomínio
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#1E2432] rounded-lg px-3 py-2 w-full sm:w-64">
                                        <IoSearchOutline className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Buscar entrega"
                                            className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none flex-1"
                                        />
                                    </div>
                                </div>
                                {entregas.map((entrega) => (
                                    <div
                                        key={entrega.id}
                                        className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#484c56] transition-colors"
                                    >
                                        <div className="flex items-start sm:items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-[#F28C38] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FiBox className="w-6 h-6 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <span className="text-sm sm:text-base font-bold text-white truncate">
                                                        {entrega.enderecoGerado}
                                                    </span>

                                                    <span className="px-2 py-0.5 bg-[#F28C38] text-white text-xs sm:text-sm rounded-full font-medium flex-shrink-0">
                                                        {entrega.status}
                                                    </span>
                                                </div>

                                                <p className="text-xs sm:text-sm text-[#D7D7D7] truncate">
                                                    {new Date(entrega.dataHoraRegistro).toLocaleString(
                                                        "pt-BR"
                                                    )}
                                                </p>

                                                <p className="text-xs text-[#D7D7D7] truncate">
                                                    Código: {entrega.codigoEntrega}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                            <Button
                                                nome="Código"
                                                estilo="transparent"
                                                className="!flex-1 sm:!w-28 !h-8 !bg-transparent !text-xs sm:!text-sm !font-normal text-[#13A9DB]"
                                            />

                                            <Button
                                                nome="Confirmar"
                                                estilo="primary"
                                                icon={<IoIosCheckmarkCircleOutline className="w-4 h-4" />}
                                                className="!flex-1 sm:!w-28 !h-8 !text-xs sm:!text-sm !font-normal"
                                                clique={() => confirmarRetirada(entrega.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
    <div className="space-y-4">
        <h2 className="title font-marmelad !text-lg sm:!text-2xl font-semibold text-white mb-4">
            Histórico de Entregas
        </h2>

        {historico.length === 0 && (
            <p className="text-gray-400 text-sm">Nenhuma entrega retirada ainda.</p>
        )}

        {historico.map((entrega) => (
            <div
                key={entrega.id}
                className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex flex-col gap-2"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4ADD80] rounded-lg flex items-center justify-center">
                        <IoIosCheckmarkCircleOutline className="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <p className="font-semibold text-white">{entrega.enderecoGerado}</p>
                        <p className="text-xs text-gray-300">
                            Retirada em: {new Date(entrega.dataHoraRetirada || Date.now()).toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-gray-300">
                            Código: {entrega.codigoEntrega}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
)}

                    </div>
                </div>
            </div>

            {showProfile && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 lg:hidden">
                    <div className="bg-transparent p-6 rounded-2xl w-90 max-w-md relative">
                        <Button
                            nome="Fechar"
                            estilo="myprofile"
                            className="!absolute -top-4 right-1 !bg-transparent text-white !text-sm !w-25"
                            clique={() => setShowProfile(false)}
                        />
                        <MyProfile
                            nome={morador?.nome || morador?.Nome}
                            cargo="Morador"
                            apartamento={morador?.apartamento || morador?.Apartamento}
                            condominio={morador?.condominio || morador?.Condominio}
                            status={morador?.status || morador?.Status}
                            tipoUsuario="morador"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


export default ResidentDashboard;