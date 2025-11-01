"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegBell } from 'react-icons/fa';
import { LuPackage } from "react-icons/lu";
import { FiAlertTriangle, FiBox  } from "react-icons/fi";
import { IoPeople, IoSearchOutline } from "react-icons/io5";
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

        {/* Cards + Lista à direita */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[140px]">
            {/* Card 1 com botão dentro */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="title font-marmelad !text-lg font-semibold -mt-3 mb-2">Entregas Hoje</h3>
                  <p className="title font-marmelad text-4xl font-bold">23</p>
                  <p className="text-sm text-[#4ADD80] mt-3">+12% desde ontem</p>
                </div>
                <div className="w-12 h-12 bg-[#1D3A53] rounded-full flex items-center justify-center">
                  <LuPackage className="w-6 h-6 text-[#98B7DE]" />
                </div>
              </div>

              {/* Botão Registro Manual */}
              <button className="mt-8 flex items-center justify-center gap-5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#23538B] to-[#116380] text-white text-xs font-medium shadow-md w-full">
                <div className="flex items-center justify-center bg-gradient-to-r from-[#328BF1] to-[#0EAED9] rounded-md p-2">
                  <LuPlus className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-semibold text-xl leading-none">Registro Manual</span>
                  <span className="text-xs font-extralight leading-none mt-1">Nova entrega na portaria</span>
                </div>
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="title font-marmelad !text-lg font-semibold -mt-3 mb-2 text-white">Na portaria</h3>
                <p className="title font-marmelad !text-4xl font-bold text-white">5</p>
                <p className="text-sm text-[#DBDB5A] mt-3">Aguardando retirada</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-[#1D3A53] rounded-full">
                <FiAlertTriangle className="w-6 h-6 text-[#98B7DE]" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="title font-marmelad !text-lg font-semibold -mt-3 mb-2 text-white">Moradores Ativos</h3>
                <p className="title font-marmelad !text-4xl font-bold text-white">156</p>
                <p className="text-sm text-[#4ADD80] mt-3">de 180 apartamentos</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-[#1D3A53] rounded-full">
                <IoPeople className="w-6 h-6 text-[#98B7DE]" />
              </div>
            </div>
          </div>

          {/* Lista de Entregas ABAIXO do botão */}
          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 space-y-4 mt-15">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="title font-marmelad !text-2xl font-semibold text-white">Entregas Hoje</h2>
                <p className="text-sm text-gray-400">Monitore todas as entregas do condomínio em tempo real</p>
              </div>
              <div className="flex items-center gap-2 bg-[#2A2F3B] rounded-lg px-3 py-2 w-64">
                <IoSearchOutline />
                <input
  type="text"
  placeholder="Busque por morador"
  className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none flex-1"
/>
              </div>
            </div>

            
              <div  className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex items-center justify-between hover:bg-[#484c56] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F28C38] rounded-lg flex items-center justify-center">
                    <FiBox  className="w-6 h-6"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">Mateus Almeida</span>
                      <span className="px-2 py-0.5 bg-[#F28C38] text-white text-sm rounded-full font-medium">Aguardando</span>
                    </div>
                    <p className="text-sm text-[#D7D7D7]">Bloco A – Apt 1205 – Entregador: Carlos Santos</p>
                    <p className="text-xs text-[#D7D7D7]">AA123456789BR – Horário: 14:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mr-4">
                  <Button 
                  nome="Notificar"
                  estilo="transparent"
                  icon={<FaRegBell />}
                  className="!w-30 !h-8 !bg-[#00000000] !text-sm !font-normal text-[#13A9DB]"
                  />
                  <Button 
                  nome="Confirmar"
                  estilo="primary"
                  icon={<IoIosCheckmarkCircleOutline />}
                  className="!w-30 !h-8 !bg-[#00000000] !text-sm !font-normal "
                  />
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PorterDashboard;