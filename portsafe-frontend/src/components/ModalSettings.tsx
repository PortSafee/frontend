import React from "react";
import { FaUser } from "react-icons/fa";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface IModalSettings {
  isOpen: boolean;
  onClose: () => void;
}

const ModalSettings: React.FC<IModalSettings> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2F3B] border-2 border-[#012032] p-6 rounded-2xl w-[90%] sm:w-[80%] md:w-[70%] lg:w-[45vw] shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-white title font-marmelad !text-2xl font-semibold text-center">
          Configurações
        </h2>
        <p className="text-white !text-sm mb-4 text-center">
          Edições das informações pessoais e profissionais
        </p>

        {/* Ícone do usuário */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#6489B5] rounded-full flex items-center justify-center mb-4">
            <FaUser className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Campos de formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <p className="text-left mt-4 text-lg pl-1 text-white">Nome Completo</p>
            <Input
              placeholder="Insira seu nome completo"
              type="text"
              className="w-full h-10 pl-4"
            />

            <p className="text-left mt-4 text-lg pl-1 text-white">Telefone</p>
            <Input
              placeholder="(15) 99999-9999"
              type="text"
              className="w-full h-10 pl-4"
            />

            <p className="text-left mt-4 text-lg pl-1 text-white">Bloco</p>
            <Input
              placeholder="Insira o seu bloco"
              type="text"
              className="w-full h-10 pl-4"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-left mt-4 text-lg pl-1 text-white">E-mail</p>
            <Input
              placeholder="Insira aqui seu e-mail"
              type="text"
              className="w-full h-10 pl-4"
            />

            <p className="text-left mt-4 text-lg pl-1 text-white">CPF</p>
            <Input
              placeholder="123.456.789-01"
              type="text"
              className="w-full h-10 pl-4"
            />

            <p className="text-left mt-4 text-lg pl-1 text-white">Apartamento</p>
            <Input
              placeholder="Insira o número do seu apartamento"
              type="text"
              className="w-full h-10 pl-4"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            nome="Cancelar"
            estilo="transparent"
            clique={onClose}
            className="!bg-transparent !w-full sm:!w-50 !rounded-2xl"
          />

          <Button
            nome="Salvar Alterações"
            estilo="primary"
            className="!w-full sm:!w-50 !rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalSettings;
