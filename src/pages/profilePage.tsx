import { useAuth } from "../store/auth";
import { Navbar } from "../components/navbar";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const user = sessionStorage.getItem("mflix_user");
  const userOb = user ? JSON.parse(user) : null;
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-xl">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <Navbar />
      <div className="mt-10 flex w-full max-w-md flex-col items-center rounded-lg bg-gray-900 p-6 shadow-lg">
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          }
          alt="Avatar"
          className="h-24 w-24 rounded-full border-4 border-red-600"
        />
        <h2 className="mt-4 text-2xl font-semibold">{userOb.nome}</h2>

        <button className="mt-6 w-full rounded bg-red-600 px-4 py-2 text-lg font-semibold transition duration-300 hover:bg-red-700">
          Gerenciar Conta
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-3 w-full rounded bg-gray-700 px-4 py-2 text-lg font-semibold transition duration-300 hover:bg-gray-600"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
