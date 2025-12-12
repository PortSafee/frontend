"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegBell, FaUser } from "react-icons/fa";
import { LuPackage, LuPlus } from "react-icons/lu";
import { FiAlertTriangle, FiBox, FiSettings } from "react-icons/fi";
import { IoPeople, IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import api from "@/config/api";
import axios from "axios";

const PorterDashboard: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [porteiro, setPorteiro] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]); // novas entregas filtradas
  const router = useRouter();

  useEffect(() => {
    // Carrega o porteiro salvo no localStorage
    try {
      const storedUser = localStorage.getItem("porteiro");
      if (storedUser) {
        setPorteiro(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erro ao ler porteiro do localStorage:", error);
      localStorage.removeItem("porteiro");
    }

    // Buscar entregas
    const fetchEntregas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/Entrega/Armazenadas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEntregas(response.data);
      } catch (err) {
        console.error("Erro ao buscar entregas:", err);
      }
    };

    fetchEntregas();
  }, []);

  const entregasHoje = entregas.filter((e) => {
    const entregaDate = new Date(e.dataHoraRegistro);
    const today = new Date();
    return (
      entregaDate.getDate() === today.getDate() &&
      entregaDate.getMonth() === today.getMonth() &&
      entregaDate.getFullYear() === today.getFullYear()
    );
  });

  const entregasPortaria = entregas.filter(
    (e) =>
      e.status === "Na portaria"
  );
  const ultimaEntrega = entregas[entregas.length - 1];

  const [searchText, setSearchText] = useState("");
  const entregasFiltradas = entregas.filter((entrega) =>
    entrega.nomeDestinatario.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
      <NavBar
        nome={porteiro?.nome || porteiro?.Nome || "Porteiro"}
        funcao="Painel do Porteiro"
        tipoUsuario="funcionario"
        onSairClick={() => router.push("/General/LoginPage")}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
        <div className="w-full lg:w-80 mx-auto lg:mx-0">
          <MyProfile
            nome={porteiro?.nome || porteiro?.Nome}
            cargo={porteiro?.cargo || "Porteiro Principal"}
            turno={porteiro?.turno || "Manhã - 06:00 às 14:00"}
            condominio={porteiro?.condominio || "Residencial Jardins"}
            status={porteiro?.status || "Em serviço"}
            tipoUsuario="funcionario"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {/* Cards/Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/*Entregas Hoje*/}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold">Entregas Hoje</h3>
              </div>
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold mt-2">{entregasHoje.length}</p>
              <p className="text-xs sm:text-sm text-[#4ADD80] mt-2">
                {entregasHoje.length > 0 ? "+1 desde ontem" : "Nenhuma entrega hoje"}
              </p>
            </div>
            {/*Na portaria*/}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold">Na Portaria</h3>
              </div>
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold mt-2">{entregasPortaria.length}</p>
              <p className="text-xs sm:text-sm text-[#4ADD80] mt-2">
                {entregasHoje.length > 0 ? "+1 desde ontem" : "Nenhuma entrega hoje"}
              </p>
            </div>
            {/*Nome do último destinatário registrado*/}
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold">Última Entrega</h3>
              </div>
              <p className="!text-xl sm:!text-2xl font-extralight mt-4">
                {ultimaEntrega?.nomeDestinatario || "Nenhum"}
              </p>
              <p className="text-xs sm:text-sm text-[#4ADD80] mt-4">
                Morador do Condomínio
              </p>
            </div>
          </div>

          {/* Botão Registro Manual */}
          <button 
          onClick={() => router.push("/Porter/ManualRegistrationPage")}
          className=" flex items-center justify-center gap-5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#23538B] to-[#116380]  text-white text-xs font-medium shadow-md w-[23.5vw] hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center bg-gradient-to-r from-[#328BF1] to-[#0EAED9] rounded-md p-2">
              <LuPlus className="w-5 h-5 " />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-xl leading-none">Registro Manual</span>
              <span className="text-xs font-extralight leading-none mt-1">Nova entrega na portaria</span>
            </div>
          </button>

          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 sm:p-6 space-y-4 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto">
            <h2 className="title font-marmelad !text-lg sm:!text-2xl font-semibold text-white mb-4">
              Entregas Hoje
            </h2>
            <p className="text-sm text-gray-400">Monitor todas as entregas do condomínio em tempo real</p>

            {/* Campo de busca */}
            <div className="relative">
              <input
                type="text"
                placeholder="Busque por morador"
                value={searchText} // estado controlado
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-[#3F434E] border border-[#012032] rounded-xl p-3 pl-10 text-sm text-white focus:outline-none"
              />
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Lista de entregas filtradas */}
            {entregasFiltradas.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma entrega armazenada.</p>
            )}

            {entregasFiltradas.map((entrega: any) => (
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
                        {entrega.nomeDestinatario}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F28C38] text-white text-xs sm:text-sm rounded-full font-medium flex-shrink-0">
                        Aguardando
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D7D7D7] truncate">
                      {entrega.endereco} – Entregador: {entrega.entregador}
                    </p>
                    <p className="text-xs text-[#D7D7D7] truncate">
                      {entrega.codigoRastreio} – Horário: {entrega.horario}
                    </p>
                  </div>
                </div>

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
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PorterDashboard;