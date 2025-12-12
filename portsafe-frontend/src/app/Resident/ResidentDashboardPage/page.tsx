"use client";

import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import MyProfile from "@/components/MyProfile";
import Button from "@/components/Button";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import api from "@/config/api";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResidentDashboard: React.FC = () => {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [morador, setMorador] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  // Carrega o morador do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("morador");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setMorador(parsedUser);
    }
  }, []);

  // Função central de carregamento
  const carregarEntregas = async () => {
    const moradorId = morador?.id || morador?.Id;
    if (!moradorId) {
      console.error("Morador ID não encontrado");
      return;
    }

    console.log("Buscando entregas para morador ID:", moradorId);
    console.log("URL da requisição:", `${api.defaults.baseURL}/api/Entrega/PorMoradorId?id=${moradorId}`);

    try {
      const response = await api.get(
        `/api/Entrega/PorMoradorId?id=${moradorId}`
      );

      let lista = response.data;

      // Normaliza status para manter consistência
      lista = lista.map((e: any) => {
        if (e.status === "No armário" || e.status === "Armazenada") e.status = "Armazenada";
        if (e.status === "AguardandoArmario") e.status = "Na portaria";
        if (e.status === "RedirecionadoPortaria") e.status = "Na portaria";
        return e;
      });

      const ativas = lista.filter((e: any) => e.status !== "Retirada");
      const historicoDb = lista.filter((e: any) => e.status === "Retirada");

      setEntregas(ativas);
      setHistorico(historicoDb);

      // Agora guardamos "lista" como a lista completa
      setAllDeliveries(lista);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro ao carregar entregas:");
        console.error("- Status:", error.response?.status);
        console.error("- URL tentada:", error.config?.url);
        console.error("- Base URL:", error.config?.baseURL);
        console.error("- Mensagem:", error.message);
        console.error("- Dados da resposta:", error.response?.data);
        
        if (error.response?.status === 404) {
          console.error("⚠️ Endpoint não encontrado. Verifique:");
          console.error("1. Se o backend está rodando em http://localhost:5000");
          console.error("2. Se o endpoint /api/Entrega/PorMoradorId existe");
          console.error("3. Se o moradorId está correto:", moradorId);
        }
      } else {
        console.error("Erro desconhecido ao carregar entregas:", error);
      }
    }
  };

  // Estado para ALL deliveries (ativas + retiradas)
  const [allDeliveries, setAllDeliveries] = useState<any[]>([]);

  // Carrega quando o morador for definido
  useEffect(() => {
    if (morador) {
      carregarEntregas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morador]);

  // Confirma entrega
  const confirmarEntrega = async (entrega: any) => {
    try {
      if (entrega.status === "Armazenada") {
        await api.post(`/api/Entrega/ConfirmarFechamento`, {
          entregaId: entrega.id,
        });
      } else if (entrega.status === "Na portaria") {
        await api.put(
          `/api/Entrega/ConfirmarRetirada?entregaId=${entrega.id}`
        );
      }

      await carregarEntregas();
      alert("Entrega confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar entrega:", error);
      alert("Falha ao confirmar entrega.");
    }
  };

  // -----------------------------
  // 📌 CARDS: ENTREGAS HOJE e MÊS — agora usam *allDeliveries*
  // -----------------------------
  const hoje = new Date().toISOString().split("T")[0];

  const entregasHoje = allDeliveries.filter((e) => {
    const data = e.dataHoraRegistro?.split("T")[0];
    return data === hoje;
  });

  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();

  const entregasMes = allDeliveries.filter((e) => {
    const data = new Date(e.dataHoraRegistro);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  // Ativas
  const entregasAguardando = entregas.filter(
  (e) => e.status === "Na portaria" || e.status === "Armazenada"
);

  const entregasFiltradas = entregas.filter(
    (e) =>
      e.enderecoGerado?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.codigoEntrega?.toLowerCase().includes(searchText.toLowerCase())
  );


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
            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold">Entregas Hoje</h3>
              </div>
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold mt-2">{entregasHoje.length}</p>
              <p className="text-xs sm:text-sm text-[#4ADD80] mt-2">
                {entregasHoje.length > 0 ? "+1 desde ontem" : "Nenhuma entrega hoje"}
              </p>
            </div>

            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold text-white">Aguardando Retirada</h3>
              </div>
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white mt-2">{entregasAguardando.length}</p>
              <p className="text-xs sm:text-sm text-[#DBDB5A] mt-2">Na portaria/No armário</p>
            </div>

            <div className="bg-[#2A2F3B] border border-[#012032] rounded-2xl p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <h3 className="title font-marmelad !text-lg sm:!text-xl font-semibold text-white">Total do Mês</h3>
              </div>
              <p className="title font-marmelad text-3xl sm:text-4xl font-bold text-white mt-2">{entregasMes.length}</p>
              <p className="text-xs sm:text-sm text-[#4ADD80] mt-2">Entregas Recebidas</p>
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
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>

                {entregasFiltradas.map((entrega) => (
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
                          {new Date(entrega.dataHoraRegistro).toLocaleString("pt-BR")}
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
                        clique={() => confirmarEntrega(entrega)}
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