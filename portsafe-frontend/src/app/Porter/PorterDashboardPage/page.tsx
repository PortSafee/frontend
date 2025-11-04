"use client";

import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegBell, FaUser } from "react-icons/fa";
import { LuPackage, LuPlus } from "react-icons/lu";
import { FiAlertTriangle, FiBox } from "react-icons/fi";
import { IoPeople, IoSearchOutline } from "react-icons/io5";

const PorterDashboard: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
      <NavBar nome="Carlos Ferreira" funcao="Painel do Porteiro" tipoUsuario="funcionario" />

      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
        {/* Botão para mostrar perfil em telas menores */}
        <button 
          onClick={() => setShowProfile(true)}
          className="lg:hidden bg-[#2A2F3B] border border-[#012032] rounded-2xl p-3 mb-4 flex items-center justify-center"
        >
          <FaUser className="w-6 h-6 text-white" />
        </button>

        {/* Perfil à esquerda - escondido em telas menores */}
        <div className="hidden lg:block lg:w-80 mx-auto lg:mx-0">
          <MyProfile
            nome="Carlos Ferreira"
            cargo="Porteiro Principal"
            turno="Manhã - 06:00 às 14:00"
            condominio="Residencial Jardins"
            status="Em serviço"
            tipoUsuario="funcionario"
          />
        </div>

        {/* Cards + Lista à direita */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 sm:p-6 flex items-start justify-between min-h-[150px]">
              <div className="flex flex-col">
                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2">Entregas Hoje</h3>
                <p className="title font-marmelad text-3xl sm:text-4xl font-bold">23</p>
                <p className="text-xs sm:text-sm text-[#4ADD80] mt-2 sm:mt-3">+12% desde ontem</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1D3A53] rounded-full flex items-center justify-center flex-shrink-0">
                <LuPackage className="w-5 h-5 sm:w-6 sm:h-6 text-[#98B7DE]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 sm:p-6 flex items-start justify-between min-h-[150px]">
              <div className="flex flex-col">
                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2 text-white">Na portaria</h3>
                <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white">5</p>
                <p className="text-xs sm:text-sm text-[#DBDB5A] mt-2 sm:mt-3">Aguardando retirada</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1D3A53] rounded-full flex-shrink-0">
                <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#98B7DE]" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 sm:p-6 flex items-start justify-between min-h-[150px]">
              <div className="flex flex-col">
                <h3 className="title font-marmelad !text-base sm:!text-lg font-semibold mb-1 sm:mb-2 text-white">Moradores Ativos</h3>
                <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white">156</p>
                <p className="text-xs sm:text-sm text-[#4ADD80] mt-2 sm:mt-3">de 180 apartamentos</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1D3A53] rounded-full flex-shrink-0">
                <IoPeople className="w-5 h-5 sm:w-6 sm:h-6 text-[#98B7DE]" />
              </div>
            </div>
          </div>

          {/* Botão Registro Manual - movido para fora dos cards */}
          <button className="flex items-center justify-center gap-2 sm:gap-4 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#23538B] to-[#116380] text-white text-sm sm:text-base font-medium shadow-md w-70 transition hover:scale-[1.02]">
            <div className="flex items-center justify-center bg-gradient-to-r from-[#328BF1] to-[#0EAED9] rounded-md p-1.5 sm:p-2">
              <LuPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col text-justify">
            <span className=" font-semibold text-sm sm:text-base ">Registro Manual</span>
            <p className=" font-light text-sm">Nova entrega na portaria</p>
            </div>
          </button>

          {/* Lista de Entregas */}
          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl mt-6 sm:mt-1 p-4 sm:p-6 space-y-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-2">
              <div>
                <h2 className="title font-marmelad !text-lg sm:!text-2xl font-semibold text-white">Entregas Hoje</h2>
                <p className="text-xs sm:text-sm text-gray-400">Monitore todas as entregas do condomínio</p>
              </div>
              <div className="flex items-center gap-2 bg-[#1E2432] rounded-lg px-3 py-2 w-full sm:w-64">
                <IoSearchOutline className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar morador"
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none flex-1"
                />
              </div>
            </div>

            {/* Item de entrega */}
            <div className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#484c56] transition-colors">
              <div className="flex items-start sm:items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-[#F28C38] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBox className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white truncate">Mateus Almeida</span>
                    <span className="px-2 py-0.5 bg-[#F28C38] text-white text-xs sm:text-sm rounded-full font-medium flex-shrink-0">Aguardando</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#D7D7D7] truncate">Bloco A – Apt 1205 – Entregador: Carlos Santos</p>
                  <p className="text-xs text-[#D7D7D7] truncate">AA123456789BR – Horário: 14:30</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-row sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  nome="Notificar"
                  estilo="transparent"
                  icon={<FaRegBell className="w-4 h-4" />}
                  className="!flex-1 sm:!w-28 !h-8 !bg-transparent !text-xs sm:!text-sm !font-normal text-[#13A9DB]"
                />
                <Button
                  nome="Confirmar"
                  estilo="primary"
                  icon={<IoIosCheckmarkCircleOutline className="w-4 h-4" />}
                  className="!flex-1 sm:!w-28 !h-8 !text-xs sm:!text-sm !font-normal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para perfil em telas menores */}
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
              nome="Carlos Ferreira"
              cargo="Porteiro Principal"
              turno="Manhã - 06:00 às 14:00"
              condominio="Residencial Jardins"
              status="Em serviço"
              tipoUsuario="funcionario"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PorterDashboard;