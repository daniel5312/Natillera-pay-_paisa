"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import CreateNatilleraForm from "@/components/createNatilleraForm";
import NatilleraList from "@/components/natilleraList"; // Importado correctamente

export default function Home() {
  const { authenticated, login } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50 text-black">
      {authenticated ? <DashboardView /> : <LoginView onLogin={login} />}
    </main>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
        Ahorro Comunitario
      </h2>
      <p className="text-gray-600 mb-8">
        Únete a tu natillera y gestiona tus pagos en Celo.
      </p>
      <button
        onClick={onLogin}
        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg"
      >
        Entrar con Farcaster
      </button>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="w-full max-w-md space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Estado de mi ahorro</p>
        <h3 className="text-3xl font-black text-blue-900">0.00 cUSD</h3>
      </div>

      {/* 1. Formulario para crear */}
      <CreateNatilleraForm />

      {/* 2. LISTA DE NATILLERAS (Aquí es donde se usa para que el error desaparezca) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-3 text-center">
          Tus Grupos Activos
        </h3>
        <NatilleraList />
      </div>
    </div>
  );
}
