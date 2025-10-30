import { GoGear } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import ButtonProfile from '@/components/Button';

interface IMyProfile {
    nome: string;
    cargo: string;
    turno: string;
    condominio: string;
    status: string;
}

export default function MyProfile({
    nome,
    cargo,
    turno,
    condominio,
    status
}: IMyProfile) {
    return (
        <div className="bg-[#2A2F3B] rounded-2xl shadow-lg w-[90%] sm:w-[320px] text-center overflow-hidden border border-[#1f2c3a]">
            {/* Cabeçalho */}
            <div className="bg-[#3F434E] py-3">
                <p className="text-white font-bold text-base">Meu Perfil</p>
            </div>

            {/* Ícone do usuário */}
            <div className="flex flex-col items-center py-6">
                <div className="w-15 h-15 bg-[#6489B5] rounded-full flex items-center justify-center mb-3">
                    <FaUser className="w-10 h-10 text-[#ffffff]" />
                </div>

                <h3 className="text-white text-lg font-semibold">{nome}</h3>
                <p className="text-[#a3acb8] text-sm font-extralight">{cargo}</p>
            </div>

            {/* Informações */}
            <div className="px-3 space-y-4 text-left">
                <div className="bg-[#3F434E] rounded-lg py-2 px-4">
                    <p className="text-gray-400 text-xs">Turno</p>
                    <p className="text-white text-sm font-medium">{turno}</p>
                </div>

                <div className="bg-[#3F434E] rounded-lg py-2 px-4">
                    <p className="text-gray-400 text-xs">Condomínio</p>
                    <p className="text-white text-sm font-medium">{condominio}</p>
                </div>

                <div className="bg-[#3F434E] rounded-lg py-2 px-4">
                    <p className="text-gray-400 text-xs">Status</p>
                    <p className="text-[#3CD173] text-sm font-medium">{status}</p>
                </div>
            </div>

            {/* Botão Configurações */}
            <div className="mt-5 mb-4 ">
            <ButtonProfile
                nome="Configurações"
                estilo="myprofile"
                className=" !w-[90%] text-white"
                icon={<GoGear />}
            />
            </div>
        </div>
    );
}
