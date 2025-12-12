"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { FiBox, FiHome } from "react-icons/fi"; // Ícone para "Na Portaria"
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
const statusParaTexto = (entrega: any): string => {
  const status = entrega.Status ?? entrega.status ?? "";
  const statusNormalizado = status.toString().trim();

  // Adicione mais mapeamentos para números, caso necessário
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
  if (statusNormalizado in STATUS_STRING_MAP) {
    return STATUS_STRING_MAP[statusNormalizado];
  }

  // Caso o status seja um número, verifica o mapeamento de números
  const num = Number(status);
  if (!isNaN(num)) {
    return mapNum[num] || "Status Desconhecido"; // Retorna o mapeado ou "Desconhecido"
  }

  return "Status Desconhecido"; // Caso não haja correspondência
};



const PorterDashboard: React.FC = () => {
  const [porteiro, setPorteiro] = useState<any>(null);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

useEffect(() => {
  const stored = localStorage.getItem("porteiro");
  if (stored) setPorteiro(JSON.parse(stored));

  const fetchEntregas = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5095/api/Entrega/Pendentes",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const normalizadas = (data ?? []).map((e: any) => ({
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
    const d = new Date(e.dataHoraRegistro);
    const hoje = new Date();
    return (
      d.getDate() === hoje.getDate() &&
      d.getMonth() === hoje.getMonth() &&
      d.getFullYear() === hoje.getFullYear()
    );
  });

  const entregasNaPortaria = entregas.filter((e) =>
  ["NaPortaria", "RedirecionadoPortaria", 5].includes(e.statusRaw)
);

  const ultimaEntrega = entregas[0]; // Mais recente (já ordenado por data desc)

  const entregasFiltradas = entregas.filter((e) =>
    e.nomeDestinatario.toLowerCase().includes(searchText.toLowerCase())
  );

  const isNaPortaria = (entrega: any) =>
    ["NaPortaria", "RedirecionadoPortaria", 5].includes(entrega.statusRaw);

  return (
    <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
      <NavBar
        nome={porteiro?.nome || porteiro?.Nome || "Porteiro"}
        funcao="Painel do Porteiro"
        tipoUsuario="funcionario"
        onSairClick={() => router.push("/General/LoginPage")}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
        {/* Perfil */}
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

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Entregas Hoje</h3>
              <p className="text-4xl font-bold mt-2">{entregasHoje.length}</p>
              <p className="text-sm text-green-400 mt-1">
                {entregasHoje.length > 0 ? "Ativas no condomínio" : "Nenhuma hoje"}
              </p>
            </div>

            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Na Portaria</h3>
              <p className="text-4xl font-bold mt-2 text-yellow-400">
                {entregasNaPortaria.length}
              </p>
              <p className="text-sm text-yellow-300 mt-1">Aguardando morador</p>
            </div>

            <div className="bg-[#2A2F3B] border-[#012032] rounded-2xl p-5">
              <h3 className="text-lg font-semibold">Última Entrega</h3>
              <p className="text-xl font-light mt-3 truncate">
                {ultimaEntrega?.nomeDestinatario || "Nenhuma"}
              </p>
              <p className="text-sm text-green-400 mt-2">Registrada hoje</p>
            </div>
          </div>

          {/* Botão Registro Manual */}
          <button
            onClick={() => router.push("/Porter/ManualRegistrationPage")}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#23538B] to-[#116380] hover:opacity-90 transition shadow-lg"
          >
            <div className="bg-gradient-to-r from-[#328BF1] to-[#0EAED9] p-3 rounded-xl">
              <LuPlus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xl">Registro Manual</div>
              <div className="text-sm opacity-90">Nova entrega na portaria</div>
            </div>
          </button>

          {/* Lista de entregas pendentes */}
          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2">Entregas Pendentes</h2>
            <p className="text-sm text-gray-400 mb-6">
              No armário ou aguardando na portaria
            </p>

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar por morador..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-[#3F434E] border border-[#012032] rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {entregasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma entrega pendente no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {entregasFiltradas.map((entrega) => (
                  <div
                    key={entrega.id}
                    className="bg-[#3F434E] border border-[#012032] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#484c56] transition"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isNaPortaria(entrega) ? 'bg-yellow-600' : 'bg-orange-600'}">
                        {isNaPortaria(entrega) ? (
                          <FiHome className="w-7 h-7" />
                        ) : (
                          <FiBox className="w-7 h-7" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-lg truncate">
                            {entrega.nomeDestinatario}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isNaPortaria(entrega)
                                ? "bg-yellow-600 text-white"
                                : "bg-orange-500 text-white"
                            }`}
                          >
                            {statusParaTexto(entrega)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1 truncate">
                          {entrega.enderecoGerado}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {entrega.dataHoraRegistro
                            ? new Date(entrega.dataHoraRegistro).toLocaleString("pt-BR")
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        nome="Notificar"
                        estilo="transparent"
                        icon={<FaRegBell className="w-5 h-5" />}
                        className="flex-1 sm:w-32 h-10 text-cyan-400 border border-cyan-400/30"
                      />
                      <Button
                        nome="Confirmar"
                        estilo="primary"
                        icon={<IoIosCheckmarkCircleOutline className="w-5 h-5" />}
                        className="flex-1 sm:w-32 h-10"
                      />
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