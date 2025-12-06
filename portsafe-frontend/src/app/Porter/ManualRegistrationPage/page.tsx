"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Logo from "@/assets/logo_portsafe.png";

const ManualRegisterPage: React.FC = () => {
  const [nomeEntregador, setNomeEntregador] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [nomeDestinatario, setNomeDestinatario] = useState("");

  // Campos dinâmicos
  const [tipoUnidade, setTipoUnidade] = useState<"Casa" | "Apartamento">("Apartamento");
  const [apartamento, setApartamento] = useState("");
  const [torre, setTorre] = useState("");
  const [cepCasa, setCepCasa] = useState("");

  const [telefone, setTelefone] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);

  // Etapas
  const [etapa, setEtapa] = useState<"form" | "fechamento">("form");
  const [dadosArmario, setDadosArmario] = useState<any>(null);

  // validação mínima no cliente antes de chamar o backend
  const validarCamposLocais = () => {
    if (!nomeDestinatario.trim()) {
      alert("Digite o nome do morador.");
      return false;
    }
    if (tipoUnidade === "Casa") {
      // DTO exige CEP para Casa
      const cepOnlyDigits = (cepCasa || "").replace(/\D/g, "");
      if (cepOnlyDigits.length !== 8) {
        alert("Para 'Casa' informe um CEP válido com 8 dígitos (somente números).");
        return false;
      }
    } else {
      // Apartamento: deve enviar pelo menos número ou torre (o backend prefere número/torre)
      if (!apartamento.trim() && !torre.trim()) {
        alert("Para 'Apartamento' informe número do apto ou torre.");
        return false;
      }
    }
    return true;
  };

  // =======================================================================
  // 1️⃣ REGISTRAR ENTREGA — VALIDAR + SOLICITAR ARMÁRIO
  // =======================================================================
  const handleRegistrar = async () => {
    try {
      if (!validarCamposLocais()) return;

      setLoading(true);

      // Monta o payload exatamente conforme ValidarDestinatarioRequestDTO
      const bodyValidacao =
        tipoUnidade === "Casa"
          ? {
              nomeDestinatario: nomeDestinatario.trim(),
              tipoUnidade: "Casa",
              cep: cepCasa.replace(/\D/g, ""), // envia somente dígitos
              numero: null,
              torre: null
            }
          : {
              nomeDestinatario: nomeDestinatario.trim(),
              tipoUnidade: "Apartamento",
              numero: apartamento ? apartamento.trim() : null,
              torre: torre ? torre.trim() : null,
              cep: null
            };

      console.log("Enviando payload ValidarDestinatario:", bodyValidacao);

      // 1) Validar destinatário
      const validarResp = await fetch("http://localhost:5095/api/Entrega/ValidarDestinatario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyValidacao)
      });

      

      // Trata respostas não-ok com segurança
      let validarData: any = null;
      try {
        validarData = await validarResp.json();
      } catch (e) {
        const txt = await validarResp.text();
        console.error("Resposta inválida do servidor (ValidarDestinatario):", validarResp.status, txt);
        alert(`Erro ao validar destinatário: ${txt || validarResp.status}`);
        return;
      }
      console.log("VALIDAR DATA COMPLETO", validarData);
      console.log("Resposta ValidarDestinatario:", validarResp.status, validarData);

      if (!validarResp.ok) {
        // servidor retornou 400/422/..., exibir mensagem retornada
        const msg = validarData?.Message || validarData?.mensagem || validarData?.mensagemErro || JSON.stringify(validarData);
        alert(msg || "Erro de validação no servidor.");
        return;
      }

      // backend DTO retorna Validado + DadosEncontrados
      if (!validarData.validado) {
        alert(validarData.mensagem || "Morador não encontrado.");
        return;
      }

      const unidadeId = validarData.dadosEncontrados?.unidadeId ?? validarData.validacaoId ?? null;
      if (!unidadeId) {
        console.warn("unidadeId não retornado pelo backend:", validarData);
        alert("Erro: unidade não identificada. Verifique logs do servidor.");
        return;
      }

      // 2) Solicitar armário (payload completo EXIGIDO pelo backend)
const solicitarPayload = {
  unidadeId: unidadeId,
  tokenValidacao: validarData.tokenValidacao, // ⚠ OBRIGATÓRIO
  nomeEntregador: nomeEntregador.trim(),
  empresa: empresa.trim(),
  observacoes: observacoes.trim(),
  telefone: validarData.dadosEncontrados?.telefoneWhatsApp || telefone.trim()
};

console.log("Payload SolicitarArmario:", solicitarPayload);

const solicitarResp = await fetch("http://localhost:5095/api/Entrega/SolicitarArmario", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(solicitarPayload)
});


      let solicitarData: any = null;
      try {
        solicitarData = await solicitarResp.json();
      } catch (e) {
        const txt = await solicitarResp.text();
        console.error("Resposta inválida do servidor (SolicitarArmario):", solicitarResp.status, txt);
        alert(`Erro ao solicitar armário: ${txt || solicitarResp.status}`);
        return;
      }

      console.log("Resposta SolicitarArmario:", solicitarResp.status, solicitarData);

      if (!solicitarResp.ok) {
        const msg = solicitarData?.mensagem || solicitarData?.Message || JSON.stringify(solicitarData);
        alert(msg || "Não há armários disponíveis.");
        return;
      }

      if (!solicitarData.sucesso && !solicitarData.NumeroArmario && !solicitarData.numeroArmario) {
        // caso o DTO tenha outro formato, logamos
        console.warn("Formato inesperado de resposta SolicitarArmario:", solicitarData);
      }

      setDadosArmario(solicitarData);
      setEtapa("fechamento");
    } catch (err) {
      console.error("Erro em handleRegistrar:", err);
      alert("Erro ao registrar entrega.");
    } finally {
      setLoading(false);
    }
  };

  // =======================================================================
  // 2️⃣ CONFIRMAR FECHAMENTO
  // =======================================================================
  const handleConfirmarFechamento = async () => {
    try {
      setLoading(true);

      if (!dadosArmario?.entregaId && !dadosArmario?.EntregaId && !dadosArmario?.entregaID) {
        alert("ID da entrega não encontrado. Refaça o processo.");
        return;
      }

      const entregaId = dadosArmario.entregaId ?? dadosArmario.EntregaId ?? dadosArmario.entregaID;

      const resp = await fetch("http://localhost:5095/api/Entrega/ConfirmarFechamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entregaId })
      });

      let data: any = null;
      try {
        data = await resp.json();
      } catch {
        const txt = await resp.text();
        console.error("Resposta inválida do servidor (ConfirmarFechamento):", resp.status, txt);
        alert(`Erro ao confirmar fechamento: ${txt || resp.status}`);
        return;
      }

      console.log("Resposta ConfirmarFechamento:", resp.status, data);

      if (!resp.ok) {
        const msg = data?.mensagem || data?.Message || JSON.stringify(data);
        alert(msg || "Erro ao confirmar fechamento.");
        return;
      }

      if (!data.sucesso) {
        alert(data.mensagem || "Erro ao confirmar fechamento.");
        return;
      }

      alert("Entrega registrada e morador notificado com sucesso!");

      // Resetar
      setEtapa("form");
      setDadosArmario(null);

      setNomeEntregador("");
      setEmpresa("");
      setNomeDestinatario("");
      setApartamento("");
      setTelefone("");
      setObservacoes("");
      setTorre("");
      setCepCasa("");
    } catch (err) {
      console.error("Erro em handleConfirmarFechamento:", err);
      alert("Erro ao confirmar fechamento.");
    } finally {
      setLoading(false);
    }
  };

  // RENDER
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-[#002236] via-black to-[#002134] overflow-x-hidden">
      {/* Lado esquerdo */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 text-center p-6">
        <img src={Logo.src} alt="Logo PortSafe" className="w-40 sm:w-56 md:w-72 lg:w-80 mb-4" />
        <p className="text-white text-base sm:text-lg md:text-2xl leading-snug">Sistema de Entregas do Condomínio</p>
      </div>

      {/* Lado direito */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-4 sm:px-6 md:px-10 py-6 md:py-0 overflow-y-auto">
        <div className="w-full max-w-[600px] bg-[#ffffff18] border-2 border-[#606060] rounded-3xl text-white text-center shadow-xl">
          <div className="flex items-center justify-center p-4 bg-[#084571] rounded-t-3xl">
            <h1 className="title font-marmelad !text-2xl sm:!text-3xl md:text-3xl">{etapa === "form" ? "Registro manual" : "Confirme o fechamento"}</h1>
          </div>

          {etapa === "form" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <p className="text-left mt-2 pl-1">Nome do Entregador</p>
                  <Input placeholder="Digite o nome do entregador" value={nomeEntregador} onChange={(e) => setNomeEntregador(e.target.value)} />

                  <p className="text-left mt-4 pl-1">Nome do Morador</p>
                  <Input placeholder="Digite o nome do morador" value={nomeDestinatario} onChange={(e) => setNomeDestinatario(e.target.value)} />
                </div>

                <div className="flex flex-col">
                  <p className="text-left mt-2 pl-1">Empresa</p>
                  <Input placeholder="Digite o nome da empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />

                  <p className="text-left mt-4 pl-1">Tipo de Unidade</p>
                  <select className="bg-[#ffffff18] border border-[#606060] rounded-xl px-3 py-2 text-white" value={tipoUnidade} onChange={(e) => setTipoUnidade(e.target.value as any)}>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                  </select>
                </div>

                {tipoUnidade === "Apartamento" && (
                  <>
                    <div className="flex flex-col">
                      <p className="text-left mt-2 pl-1">Apartamento (número)</p>
                      <Input placeholder="Ex: 1205" value={apartamento} onChange={(e) => setApartamento(e.target.value)} />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-left mt-2 pl-1">Torre</p>
                      <Input placeholder="Ex: Torre A" value={torre} onChange={(e) => setTorre(e.target.value)} />
                    </div>
                  </>
                )}

                {tipoUnidade === "Casa" && (
                  <div className="col-span-2 flex flex-col">
                    <p className="text-left mt-2 pl-1">CEP da Casa (somente números)</p>
                    <Input placeholder="Ex: 18000000" value={cepCasa} onChange={(e) => setCepCasa(e.target.value)} />
                  </div>
                )}

                <div className="col-span-2 flex flex-col">
                  <p className="text-left mt-2 pl-1">Telefone do morador</p>
                  <Input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>

                <div className="col-span-2 flex flex-col">
                  <p className="text-left mt-2 pl-1">Observações</p>
                  <Input placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
                </div>
              </div>

              <Button nome={loading ? "Processando..." : "Registrar Entrega"} estilo="secundary" className="w-full py-3 !text-lg" clique={handleRegistrar} />
            </div>
          )}

          {etapa === "fechamento" && dadosArmario && (
            <div className="p-6 flex flex-col space-y-4">
              <p className="text-lg">
                Armário: <strong>{dadosArmario.numeroArmario ?? dadosArmario.NumeroArmario ?? dadosArmario.numero}</strong>
              </p>
              <p className="text-sm opacity-80">Deposite o pacote e feche a porta.</p>

              <Button nome={loading ? "Confirmando..." : "Confirmar Fechamento"} estilo="secundary" className="w-full py-3 !text-lg" clique={handleConfirmarFechamento} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualRegisterPage;
