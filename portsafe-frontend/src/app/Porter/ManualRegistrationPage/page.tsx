"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/assets/logo_portsafe.png";
import Image from "next/image";

interface DadosArmario {
  sucesso: boolean;
  status: string;
  entregaId: number | null;
  raw: unknown;
  numeroArmario?: number;
  NumeroArmario?: number;
  numero?: number;
}

const ManualRegisterPage: React.FC = () => {
  const [nomeEntregador, setNomeEntregador] = useState("");
  const [nomeDestinatario, setNomeDestinatario] = useState("");

  // Campos dinâmicos
  const [tipoUnidade, setTipoUnidade] = useState<"Casa" | "Apartamento">("Apartamento");
  const [apartamento, setApartamento] = useState("");
  const [torre, setTorre] = useState("");
  const [cepCasa, setCepCasa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [tipoEntrega, setTipoEntrega] = useState<"Perecível" | "Volumosa">("Perecível");

  const [loading, setLoading] = useState(false);

  // Etapas
  const [etapa, setEtapa] = useState<"form" | "fechamento">("form");
  const [dadosArmario, setDadosArmario] = useState<DadosArmario | null>(null);

  const validarCamposLocais = () => {
    if (!nomeDestinatario.trim()) {
      alert("Digite o nome do morador.");
      return false;
    }

    if (tipoUnidade === "Casa") {
      const cepOnlyDigits = (cepCasa || "").replace(/\D/g, "");
      if (cepOnlyDigits.length !== 8) {
        alert("Para 'Casa' informe um CEP válido com 8 dígitos.");
        return false;
      }
    } else {
      if (!apartamento.trim() && !torre.trim()) {
        alert("Para 'Apartamento' informe número do apto ou torre.");
        return false;
      }
    }

    return true;
  };

  // ======================================================
  // 1️⃣ REGISTRAR ENTREGA
  // ======================================================
  const handleRegistrar = async () => {
    try {
      if (!validarCamposLocais()) return;

      setLoading(true);

      const bodyValidacao =
        tipoUnidade === "Casa"
          ? {
              NomeDestinatario: nomeDestinatario.trim(),
              TipoUnidade: "Casa",
              CEP: cepCasa.replace(/\D/g, ""),
              Numero: null,
              Torre: null,
            }
          : {
              NomeDestinatario: nomeDestinatario.trim(),
              TipoUnidade: "Apartamento",
              Numero: apartamento ? apartamento.trim() : null,
              Torre: torre ? torre.trim() : null,
              CEP: null,
            };


      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://portsafee-api-ls93.onrender.com";
      const validarResp = await fetch(`${apiUrl}/api/Entrega/ValidarDestinatario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyValidacao),
      });

      const validarData = await validarResp.json();

      if (!validarResp.ok || !validarData.validado) {
        alert(validarData?.mensagem || "Morador não encontrado.");
        return;
      }

      const unidadeId =
        validarData.dadosEncontrados?.unidadeId ??
        validarData.validacaoId ??
        null;

      if (!unidadeId) {
        alert("Erro: unidade não identificada.");
        return;
      }

      const acionarPayload = {
  NomeDestinatario: nomeDestinatario.trim(),
  CEP:
    tipoUnidade === "Casa"
      ? cepCasa.replace(/\D/g, "")
      : "18000000" // CEP padrão para apartamentos
};


      const acionarResp = await fetch(`${apiUrl}/api/Entrega/AcionarPortaria`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(acionarPayload),
      });

      const acionarData = await acionarResp.json();

      if (!acionarResp.ok) {
        alert(acionarData?.mensagem || "Erro ao registrar entrega na portaria.");
        return;
      }

      const entregaId =
        acionarData?.ProtocoloAtendimento ??
        acionarData?.protocoloAtendimento ??
        acionarData?.protocolo ??
        acionarData?.EntregaId ??
        acionarData?.entregaId ??
        null;

      setDadosArmario({
        sucesso: true,
        status: "Na Portaria",
        entregaId,
        raw: acionarData,
      });

      setEtapa("fechamento");

    } catch (err) {
      console.error("Erro em handleRegistrar:", err);
      alert("Erro ao registrar entrega.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // 2️⃣ CONFIRMAR FECHAMENTO
  // ======================================================
  const handleConfirmarFechamento = async () => {
    alert("Entrega registrada com sucesso na Portaria!");
    setEtapa("form");
    setDadosArmario(null);
    setNomeEntregador("");
    setNomeDestinatario("");
    setApartamento("");
    setTelefone("");
    setObservacoes("");
    setTorre("");
    setCepCasa("");
    setTipoEntrega("Perecível");
  };

  // RENDER
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
      {/* Lado esquerdo */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
        <Image src={Logo} alt="Logo PortSafe" width={320} height={320} className="w-40 sm:w-56 md:w-72 lg:w-80 mb-4" />
        <p className="text-white text-base sm:text-lg md:text-2xl leading-snug">
          Sistema de Entregas do Condomínio
        </p>
      </div>

      {/* Lado direito */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 py-6 md:py-0 overflow-y-auto">
        <div className="w-full max-w-[600px] bg-[#ffffff18] border-2 border-[#606060] rounded-3xl text-white text-center shadow-xl">

          <div className="flex flex-col items-center justify-center p-8 bg-[#084571] rounded-t-3xl min-h-[150px]">
            <h1 className="title font-marmelad text-2xl">Registro Manual</h1>
            <h3 className="mt-2">Preencha os dados de entrega</h3>
          </div>

          {etapa === "form" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                <div className="flex flex-col">
                  <p className="text-left mt-2 pl-1">Nome do Entregador</p>
                  <Input
                    placeholder="Digite o nome do entregador"
                    value={nomeEntregador}
                    onChange={(e) => setNomeEntregador(e.target.value)}
                    className="h-8 pl-2"
                  />

                  <p className="text-left mt-4 pl-1">Nome do Morador</p>
                  <Input
                    placeholder="Digite o nome do morador"
                    value={nomeDestinatario}
                    onChange={(e) => setNomeDestinatario(e.target.value)}
                    className="h-8 pl-2"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-left mt-2 pl-1">Tipo de Entrega</p>
                  <select
                    className="bg-[#333B40] border border-[#606060] h-8 rounded-xl px-3 py-1 text-white"
                    value={tipoEntrega}
                    onChange={(e) => setTipoEntrega(e.target.value as "Perecível" | "Volumosa")}
                  >
                    <option value="Perecível">Perecível</option>
                    <option value="Volumosa">Volumosa</option>
                  </select>

                  <p className="text-left mt-4 pl-1">Tipo de Unidade</p>
                  <select
                    className="bg-[#333B40] border border-[#606060] h-8 rounded-xl px-3 py-1 text-white"
                    value={tipoUnidade}
                    onChange={(e) => setTipoUnidade(e.target.value as "Casa" | "Apartamento")}
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                  </select>
                </div>

                {tipoUnidade === "Apartamento" && (
                  <>
                    <div className="flex flex-col">
                      <p className="text-left mt-2 pl-1">Apartamento (número)</p>
                      <Input
                        placeholder="Ex: 1205"
                        value={apartamento}
                        onChange={(e) => setApartamento(e.target.value)}
                        className="h-8 pl-2"
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-left mt-2 pl-1">Torre</p>
                      <Input
                        placeholder="Ex: Torre A"
                        value={torre}
                        onChange={(e) => setTorre(e.target.value)}
                        className="h-8 pl-2"
                      />
                    </div>
                  </>
                )}

                {tipoUnidade === "Casa" && (
                  <div className="col-span-2 flex flex-col">
                    <p className="text-left mt-2 pl-1">CEP da Casa (somente números)</p>
                    <Input
                      placeholder="Ex: 18000000"
                      value={cepCasa}
                      onChange={(e) => setCepCasa(e.target.value)}
                      className="h-8 pl-2"
                    />
                  </div>
                )}

                <div className="col-span-2 flex flex-col">
                  <p className="text-left mt-2 pl-1">Telefone do morador</p>
                  <Input
                    placeholder="Digite o telefone do morador"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="h-8 pl-2"
                  />
                </div>

                <div className="col-span-2 flex flex-col">
                  <p className="text-left mt-2 pl-1">Observações</p>
                  <Input
                    placeholder="Observações"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="h-16 pl-2"
                  />
                </div>

              </div>

              <Button
                nome={loading ? "Processando..." : "Registrar Entrega"}
                estilo="secundary"
                className="w-full py-3 !text-lg"
                clique={handleRegistrar}
              />
            </div>
          )}

          {etapa === "fechamento" && dadosArmario && (
            <div className="p-6 flex flex-col space-y-4">
              <p className="text-lg">
                {dadosArmario.status === "Na Portaria"
                  ? "Status: Na Portaria"
                  : `Armário: ${
                      dadosArmario.numeroArmario ??
                      dadosArmario.NumeroArmario ??
                      dadosArmario.numero
                    }`}
              </p>

              {dadosArmario.status !== "Na Portaria" && (
                <p className="text-sm opacity-80">Deposite o pacote e feche a porta.</p>
              )}

              <Button
                nome={loading ? "Confirmando..." : "Confirmar Entrega"}
                estilo="secundary"
                className="w-full py-3 !text-lg"
                clique={handleConfirmarFechamento}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManualRegisterPage;