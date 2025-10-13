interface IBotao {
  nome: string;
  estilo: "primary" | "secundary";
  clique: () => void;
  className?: string;
}

export default function Button({ nome, estilo, clique, className }: IBotao) {
  return (
    <button
      onClick={clique}
      className={`btn btn-${estilo} ${className ?? ""}`}
    >
      {nome}
    </button>
  );
}
