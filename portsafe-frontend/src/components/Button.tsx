interface IBotao {
  nome: string;
  estilo: "primary" | "secundary" | "portaria" | "entregador";
  clique?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({ nome, estilo, clique, className, icon }: IBotao) {
  return (
    <button
      onClick={clique}
       className={`flex items-center justify-center gap-2 btn btn-${estilo} ${className ?? ""}`}
    >
      {nome}
      {icon && <span>{icon}</span>} {/* renderiza o ícone se existir */}

    </button>
  );
}
