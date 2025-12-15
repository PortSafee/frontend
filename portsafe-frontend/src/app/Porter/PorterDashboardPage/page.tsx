"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import { LuPlus } from "react-icons/lu";
import { FiBox } from "react-icons/fi"; // Ícone para "Na Portaria"
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mapeamento para cobrir exatamente o que o backend envia
const STATUS_STRING_MAP: Record<string, string> = {
  NaPortaria: "Na Portaria",
  Armazenada: "Armazenada",
  AguardandoValidacao: "Aguardando Validação",
  AguardandoArmario: "Aguardando Armário",
  Retirada: "Retirada",
  ErroValidacao: "Erro Validação",
  RedirecionadoPortaria: "Na Portaria", 
};

// Função para mapear o status
const statusParaTexto = (entrega: Record<string, unknown>): string => {
  const status = (entrega.Status ?? entrega.status ?? "").toString().trim();


  const mapNum: Record<number, string> = {
     0: "Aguardando Validação",
  1: "Aguardando Armário",
  2: "Aguardando Retirada",
  3: "Retirada",
  4: "Armazenada",
  5: "RedirecionadoPortaria",
  6: "Na portaria"
  };

  // Tenta primeiro usar o mapeamento para strings
  if (status in STATUS_STRING_MAP) {
    return STATUS_STRING_MAP[status];
  }

  // Caso o status seja um número, verifica o mapeamento de números
  const num = Number(status);
  if (!isNaN(num)) {
    return mapNum[num] || "Status Desconhecido"; // Retorna o mapeado ou "Desconhecido"
  }

  return "Status Desconhecido"; // Caso não haja correspondência
};



const PorterDashboard: React.FC = () => {
  const [porteiro, setPorteiro] = useState<Record<string, unknown> | null>(null);
  const [entregas, setEntregas] = useState<Record<string, unknown>[]>([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

useEffect(() => {
  const stored = localStorage.getItem("porteiro");
  if (stored) setPorteiro(JSON.parse(stored));

  const fetchEntregas = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://portsafee-api-ls93.onrender.com";
      const { data } = await axios.get(
        `${apiUrl}/api/Entrega/Pendentes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const normalizadas = (data ?? []).map((e: Record<string, unknown>) => ({
        ...e,
        id: e.Id ?? e.id,
        nomeDestinatario: e.NomeDestinatario ?? e.nomeDestinatario ?? "Não informado",
        enderecoGerado: e.EnderecoGerado ?? e.enderecoGerado ?? "Endereço não informado",
        dataHoraRegistro: e.DataHoraRegistro ?? e.dataHoraRegistro,
        statusRaw: e.Status ?? e.status ?? "", // Garantir que statusRaw nunca seja undefined
      }));

      setEntregas(normalizadas);
    } catch (err) {
      console.error("Erro ao carregar entregas pendentes:", err);
    }
  };

  fetchEntregas();
}, []);

  // Filtros
  const entregasHoje = entregas.filter((e) => {
    if (!e.dataHoraRegistro) return false;
    const d = new Date(e.dataHoraRegistro as string);
    const hoje = new Date();
    return (
      d.getDate() === hoje.getDate() &&
      d.getMonth() === hoje.getMonth() &&
      d.getFullYear() === hoje.getFullYear()
    );
  });

  const entregasNaPortaria = entregas.filter((e) => {
  const status = e.statusRaw;
  return (
    status === "NaPortaria" ||
    status === "RedirecionadoPortaria" ||
    status === 5 ||
    status === 6
  );
});


  const ultimaEntrega = entregas[0]; 

  const entregasFiltradas = entregas.filter((e) =>
    (e.nomeDestinatario as string).toLowerCase().includes(searchText.toLowerCase())
  );

  const isNaPortaria = (entrega: Record<string, unknown>) =>
    ["NaPortaria", "RedirecionadoPortaria", 5].includes(entrega.statusRaw as string | number);

  return (
    <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
      <NavBar
        nome={(porteiro?.nome || porteiro?.Nome || "Porteiro") as string}
        funcao="Painel do Porteiro"
        tipoUsuario="funcionario"
        onSairClick={() => router.push("/General/LoginPage")}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
        {/* Perfil */}
        <div className="w-full lg:w-80 mx-auto lg:mx-0">
          <MyProfile
            nome={(porteiro?.nome || porteiro?.Nome) as string}
            cargo={(porteiro?.cargo || "Porteiro Principal") as string}
            turno={(porteiro?.turno || "Manhã - 06:00 às 14:00") as string}
            condominio={(porteiro?.condominio || "Residencial Jardins") as string}
            status={(porteiro?.status || "Em serviço") as string}
            tipoUsuario="funcionario"
          />
        </div>

        {/* Conteúdo principal */}
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
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold mt-2">{entregasNaPortaria.length}</p>
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
                {(ultimaEntrega?.nomeDestinatario as string) || "Nenhum"}
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

          {/* Lista de entregas pendentes */}
          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
                              <div>
                                <h2 className="title font-marmelad !text-2xl font-semibold text-white">
                                  Entregas Pendentes
                                </h2>
                                <p className="text-sm text-gray-400">
                                 No armário ou aguardando na portaria
                                </p>
                              </div>
            
                              <div className="flex items-center gap-2 bg-[#1E2432] rounded-lg px-3 py-2 w-full sm:w-64">
                                <IoSearchOutline className="w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Buscar por morador"
                                  className="bg-transparent text-sm text-gray-300 outline-none flex-1"
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}
                                />
                              </div>
                            </div>
            

            {entregasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma entrega pendente no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {entregasFiltradas.map((entrega) => (
                  <div
                    key={entrega.id as string | number}
                    className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#F28C38] rounded-lg flex items-center justify-center">
                                              <FiBox className="w-6 h-6 text-white" />
                                            </div>
                      

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <span className="font-bold text-white truncate">
                            {entrega.nomeDestinatario as string}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isNaPortaria(entrega)
                                ? " bg-[#F28C38] text-white"
                                : " bg-[#F28C38] text-white"
                            }`}
                          >
                            {statusParaTexto(entrega)}
                          </span>
                        </div>
                        <p className="text-xs text-[#D7D7D7]">
                          {entrega.enderecoGerado as string}
                        </p>
                        <p className="text-xs text-[#D7D7D7]">
                          {entrega.dataHoraRegistro
                            ? new Date(entrega.dataHoraRegistro as string).toLocaleString("pt-BR")
                            : "-"}
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
    </div>
  );
};

export default PorterDashboard;