"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useRouter } from "next/navigation";

type UIEntrega = {
  Id: number;
  enderecoGerado?: string;
  codigoEntrega?: string | null;
  dataHoraRegistro?: string | null;
  dataHoraRetirada?: string | null;
  status: number;
  armarioId?: number | null;
};

const STATUS_MAP: Record<number, string> = {
  0: "Aguardando Validação",
  1: "Aguardando Armário",
  2: "Aguardando Retirada",
  3: "Retirada",
  4: "Armazenada",
  5: "RedirecionadoPortaria",
  6: "Na portaria"
};

const statusParaTexto = (status: number | string) => {
  const s = Number(status);
  return STATUS_MAP[s] ?? `Status ${s}`;
};

const ResidentDashboard: React.FC = () => {
  const router = useRouter();

  // Estado da UI
  const [showProfile, setShowProfile] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Estado dos dados
  const [morador, setMorador] = useState<Record<string, unknown> | null>(null);
  const [todasEntregas, setTodasEntregas] = useState<UIEntrega[]>([]);
  const [entregasAtivas, setEntregasAtivas] = useState<UIEntrega[]>([]);
  const [entregasHistorico, setEntregasHistorico] = useState<UIEntrega[]>([]);

  // Carregar morador do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("morador");
    if (stored) setMorador(JSON.parse(stored));
  }, []);

  // Carregar entregas quando morador estiver disponível
  useEffect(() => {
    if (morador) carregarEntregas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morador]);

  // Função para normalizar entrega
  const normalizarEntrega = (e: Record<string, unknown>): UIEntrega => ({
    Id: (e.Id ?? e.id) as number,
    enderecoGerado: (e.EnderecoGerado ?? e.enderecoGerado) as string | undefined,
    codigoEntrega: (e.CodigoEntrega ?? e.codigoEntrega) as string | null | undefined,
    dataHoraRegistro: (e.DataHoraRegistro ?? e.dataHoraRegistro) as string | null | undefined,
    dataHoraRetirada: (e.DataHoraRetirada ?? e.dataHoraRetirada) as string | null | undefined,
    status: typeof e.Status === "number" ? e.Status : Number((e.status ?? 0) as number | string),
    armarioId: (e.ArmarioId ?? e.ArmariumId ?? null) as number | null,
  });

  // Função para carregar entregas
  const carregarEntregas = async () => {
    const id = morador?.Id ?? morador?.id;
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5095/api/Entrega/PorMoradorId?id=${id}&t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const lista = (data ?? []).map(normalizarEntrega);

      setTodasEntregas(lista);
      setEntregasAtivas(lista.filter((x: UIEntrega) => x.status !== 3));
      setEntregasHistorico(lista.filter((x: UIEntrega) => x.status === 3));
    } catch (err) {
      console.error("Erro ao carregar entregas:", err);
    }
  };

  // Função para confirmar retirada
  const confirmarEntrega = async (entrega: UIEntrega) => {
    try {
      if (![2, 4, 5, 6].includes(entrega.status))
        return alert("Esta entrega já foi retirada.");

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5095/api/Entrega/ConfirmarRetirada?entregaId=${entrega.Id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await carregarEntregas();
      alert("Entrega confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar entrega:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.Message || error.response?.data?.message || "Erro ao confirmar entrega.";
        alert(errorMessage);
      } else {
        alert("Erro ao confirmar entrega.");
      }
    }
  };

  // Valores computados para métricas
  const hoje = new Date().toISOString().split("T")[0];
  const entregasHoje = todasEntregas.filter(
    (e) => e.dataHoraRegistro?.split("T")[0] === hoje
  );

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const entregasMes = todasEntregas.filter((e) => {
    if (!e.dataHoraRegistro) return false;
    const d = new Date(e.dataHoraRegistro);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  const entregasAguardando = entregasAtivas.filter(
    (e) => e.status === 2 || e.status === 4 || e.status === 6
  );

  // Filtro das entregas ativas baseado na busca
  const entregasFiltradas = entregasAtivas.filter((e) =>
    (e.enderecoGerado ?? "")
      .toLowerCase()
      .includes(searchText.toLowerCase()) ||
    (e.codigoEntrega ?? "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // Renderização da UI
  return (
    <div className="min-h-screen bg-[#131826] text-white overflow-x-hidden">
      <NavBar
        nome={(morador?.nome ?? morador?.Nome ?? "Morador") as string}
        funcao="Painel do Morador"
        tipoUsuario="morador"
        onSairClick={() => router.push("/General/LoginPage")}
        onChatClick={() => router.push("/Resident/ChatBot")}
      />

      <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:p-8">
        {/* Botão mobile para perfil */}
        <button
          onClick={() => setShowProfile(true)}
          className="lg:hidden bg-[#2A2F3B] border border-[#012032] rounded-2xl p-3 mb-4 flex items-center justify-center"
        >
          <FaUser className="w-6 h-6 text-white" />
        </button>

        {/* Perfil desktop */}
        <div className="hidden lg:block lg:w-80 mx-auto lg:mx-0">
          <MyProfile
            nome={(morador?.nome ?? morador?.Nome) as string}
            cargo="Morador"
            apartamento={(morador?.apartamento ?? morador?.Apartamento) as string}
            condominio={(morador?.condominio ?? morador?.Condominio) as string}
            status={(morador?.status ?? morador?.Status) as string}
            tipoUsuario="morador"
          />
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4">
              <h3 className="title font-marmelad !text-lg font-semibold">
                Entregas Hoje
              </h3>
              <p className="title font-marmelad !text-4xl font-bold mt-2">
                {entregasHoje.length}
              </p>
              <p className="text-xs text-[#4ADD80] mt-2">
                {entregasHoje.length > 0 ? "+1 desde ontem" : "Nenhuma entrega hoje"}
              </p>
            </div>

            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4">
              <h3 className="title font-marmelad !text-lg font-semibold text-white">
                Aguardando Retirada
              </h3>
              <p className="title font-marmelad !text-4xl font-bold mt-2">
                {entregasAguardando.length}
              </p>
              <p className="text-xs text-[#DBDB5A] mt-2">Na portaria/No armário</p>
            </div>

            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4">
              <h3 className="title font-marmelad !text-lg font-semibold text-white">
                Total do Mês
              </h3>
              <p className="title font-marmelad !text-4xl font-bold mt-2">
                {entregasMes.length}
              </p>
              <p className="text-xs text-[#4ADD80] mt-2">Entregas Recebidas</p>
            </div>
          </div>

          {/* Toggle entre Ativas e Histórico */}
          <div className="bg-[#2E323C] p-2 rounded-2xl w-fit flex items-center">
            <button
              onClick={() => setIsActive(true)}
              className={`px-5 py-1.5 text-white font-medium text-sm rounded-2xl ${isActive
                  ? "bg-gradient-to-r from-[#328BF1] to-[#0EAED9]"
                  : "bg-transparent"
                }`}
            >
              Entregas Ativas
            </button>

            <button
              onClick={() => setIsActive(false)}
              className={`px-5 py-1.5 text-white font-medium text-sm rounded-2xl ${!isActive
                  ? "bg-gradient-to-r from-[#328BF1] to-[#0EAED9]"
                  : "bg-transparent"
                }`}
            >
              Histórico
            </button>
          </div>

          {/* Lista de entregas */}
          <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {isActive ? (
              <>
                {/* Cabeçalho e filtro para ativas */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
                  <div>
                    <h2 className="title font-marmelad !text-2xl font-semibold text-white">
                      Entregas Ativas
                    </h2>
                    <p className="text-sm text-gray-400">
                      Monitore todas as entregas
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#1E2432] rounded-lg px-3 py-2 w-full sm:w-64">
                    <IoSearchOutline className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar entrega"
                      className="bg-transparent text-sm text-gray-300 outline-none flex-1"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>

                {/* Lista de entregas ativas */}
                {entregasFiltradas.map((entrega) => (
                  <div
                    key={entrega.Id}
                    className="bg-[#3F434E] border border-[#012032] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#F28C38] rounded-lg flex items-center justify-center">
                        <FiBox className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <span className="font-bold text-white truncate">
                            {entrega.enderecoGerado}
                          </span>

                          <span className="px-2 py-1 bg-[#F28C38] text-white text-xs rounded-full">
                            {statusParaTexto(entrega.status)}
                          </span>
                        </div>

                        <p className="text-xs text-[#D7D7D7]">
                          {entrega.dataHoraRegistro
                            ? new Date(entrega.dataHoraRegistro).toLocaleString(
                              "pt-BR"
                            )
                            : ""}
                        </p>

                        <p className="text-xs text-[#D7D7D7]">
                          Código: {entrega.codigoEntrega}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3">

                      <Button
                        nome="Confirmar"
                        estilo="primary"
                        icon={<IoIosCheckmarkCircleOutline className="w-4 h-4" />}
                        className="!w-28 !h-8 mt-2"
                        clique={() => confirmarEntrega(entrega)}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              /* Histórico de entregas */
              <div className="space-y-4">
                <h2 className="title font-marmelad !text-2xl font-semibold text-white mb-4">
                  Histórico de Entregas
                </h2>

                {entregasHistorico.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    Nenhuma entrega retirada ainda.
                  </p>
                )}

                {entregasHistorico.map((entrega) => (
                  <div
                    key={entrega.Id}
                    className="bg-[#3F434E] border border-[#012032] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4ADD80] rounded-lg flex items-center justify-center">
                        <IoIosCheckmarkCircleOutline className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {entrega.enderecoGerado}
                        </p>

                        <p className="text-xs text-gray-300">
                          Retirada em:{" "}
                          {entrega.dataHoraRetirada
                            ? new Date(
                              entrega.dataHoraRetirada
                            ).toLocaleString("pt-BR")
                            : ""}
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

      {/* Modal de perfil mobile */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 lg:hidden">
          <div className="bg-transparent p-6 rounded-2xl max-w-md relative">
            <Button
              nome="Fechar"
              estilo="myprofile"
              className="!absolute -top-4 right-1 text-white text-sm"
              clique={() => setShowProfile(false)}
            />

            <MyProfile
              nome={(morador?.nome ?? morador?.Nome) as string}
              cargo="Morador"
              apartamento={(morador?.apartamento ?? morador?.Apartamento) as string}
              condominio={(morador?.condominio ?? morador?.Condominio) as string}
              status={(morador?.status ?? morador?.Status) as string}
              tipoUsuario="morador"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;