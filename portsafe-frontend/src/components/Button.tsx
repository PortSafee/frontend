interface IBotao {
  nome: string;
  estilo: "primary" | "logout" | "outline" | "success" | "error" | "transparent";
  clique: () => void;
}

export default function Button({ nome, estilo, clique }: IBotao) {
  return (
    <input
      type="button"
      value={nome}
      onClick={clique}
      className={`btn btn-${estilo}`} // Usa as classes definidas no global.css
    />
  );
}
