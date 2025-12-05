import { FaRegBell, FaUserCheck } from 'react-icons/fa';
import { BiExit } from 'react-icons/bi';
import { BsChatDots } from "react-icons/bs";

import escritaPortSafe from '@/assets/escritaPortSafe.png';

interface INavBar {
  nome: string;
  funcao: string;
  tipoUsuario: "funcionario" | "morador";
  onPerfilClick?: () => void;
  onSairClick?: () => void;
  onChatClick?: () => void;
}

export default function Navbar({
  nome,
  funcao,
  tipoUsuario,
  onPerfilClick,
  onSairClick,
  onChatClick
}: INavBar) {
  return (
    <nav className="bg-[#0a1f2e] px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        <img
          src={escritaPortSafe.src}
          alt="Escrita PortSafe"
          className="w-[30%] sm:w-[18%] mx-2 sm:mx-4 mt-2 mb-2"
        />
        <span className="hidden sm:inline text-white font-semibold">{funcao}</span>
        

      </div>
      <div className="flex items-center gap-2 sm:gap-6 text-white">
        {tipoUsuario === "morador" && (
          <>
            <BsChatDots className="w-4 h-4 sm:w-5 sm:h-5" />
            <span onClick={onChatClick} className="hidden sm:inline">Assistente</span>
          </>
        )}
        <button
          onClick={onPerfilClick}
          className="hidden sm:flex items-center gap-2 hover:text-[#328BF1] transition"
        >
          <FaUserCheck className="w-5 h-5" />
          <span>{nome}</span>
        </button>
        <button
          onClick={onSairClick}
          className="flex items-center hover:text-[#328BF1] transition"
        >
          <BiExit className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </nav>
  );
}