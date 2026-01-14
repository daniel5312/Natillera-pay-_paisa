"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { login, authenticated, logout, user } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="text-xl font-bold text-blue-900">Natillera Pay 💰</div>
      <div>
        {!authenticated ? (
          <button
            onClick={login}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all"
          >
            Conectar
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-600">
              {user?.wallet?.address?.slice(0, 6)}...
              {user?.wallet?.address?.slice(-4)}
            </span>
            <button
              onClick={logout}
              className="text-red-500 text-sm font-medium hover:underline"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
