import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold text-red-600">Mflix</h1>
      <h2 className="mt-6 text-4xl font-semibold">Página não encontrada</h2>
      <p className="mt-4 text-lg text-gray-400">
        Desculpe, não conseguimos encontrar essa página. 😢
      </p>
      <Link
        to="/"
        className="mt-6 rounded bg-red-600 px-6 py-3 text-lg font-semibold transition duration-300 hover:bg-red-700"
      >
        Voltar para a Home
      </Link>
      <img
        src="https://media.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif"
        alt="Lost"
        className="mt-6 w-80 rounded"
      />
    </div>
  );
}
