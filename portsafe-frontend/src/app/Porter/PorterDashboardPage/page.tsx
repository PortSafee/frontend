"use client";

import React from "react";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import { LuPackage } from "react-icons/lu";
import { FiAlertTriangle } from "react-icons/fi";
import { IoPeople } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";


const PorterDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#131826] text-white">
            <NavBar nome="Carlos Ferreira" funcao="Painel do Porteiro" />

            <div className="flex gap-6 p-8">
                {/* Perfil à esquerda */}
                <div className="w-80">
                    <MyProfile
                        nome="Carlos Ferreira"
                        cargo="Porteiro Principal"
                        turno="Manhã - 06:00 às 14:00"
                        condominio="Residencial Jardins"
                        status="Em serviço"
                    />
                </div>

                {/* Cards à direita */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex items-start justify-between h-[34%]">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-2 text-white">Entregas Hoje</h3>
                            <p className=" title font-marmelad text-4xl font-bold text-white mt-1">23</p>
                            <p className="text-sm text-[#4ADD80] mt-4">+12% desde ontem</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-[#1D3A53] rounded-full">
                            <LuPackage className="w-6 h-6 text-[#98B7DE]" />
                        </div>
                    </div>

                    <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex items-start justify-between h-[34%]">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-2 text-white">Na portaria</h3>
                            <p className="title font-marmelad text-4xl font-bold text-white mt-1">5</p>
                            <p className="text-sm text-[#DBDB5A] mt-4">Aguardando retirada</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-[#1D3A53] rounded-full">
                            <FiAlertTriangle className="w-6 h-6 text-[#98B7DE]" />
                        </div>
                    </div>

                    <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex items-start justify-between h-[34%]">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-2 text-white">Moradores Ativos</h3>
                            <p className=" title font-marmelad text-4xl font-bold text-white mt-1">156</p>
                            <p className="text-sm text-[#4ADD80] mt-4">de 180 apartamentos</p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-[#1D3A53] rounded-full">
                            <IoPeople className="w-6 h-6 text-[#98B7DE]" />
                        </div>
                    </div>                    
                </div>                
            </div> <Button
                        nome="Registro Manual"
                        estilo="primary"
                        icon={
                            <div className="flex items-center gap-2">
                                <LuPlus className="w-5 h-5" />
                                <div className="flex flex-col items-start">
                                    <span className="text-xs opacity-80">Nova entrega na portaria</span>
                                </div>
                            </div>
                        }
                        className="px-6 py-3 rounded-full"
                    />           
        </div>
    );
};

export default PorterDashboard;
