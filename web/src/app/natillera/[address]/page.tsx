"use client";

import { use } from "react";
import Link from "next/link";

export default function PaginaDetalleNatillera({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  // Extraemos la dirección de la URL de forma segura
  const { address } = use(params);

  return (
    <div className="p-8 max-w-xl mx-auto text-black">
      <Link href="/" className="text-blue-600 mb-4 block">
        ← Volver al Dashboard
      </Link>

      <div className="bg-white p-6 rounded-3xl shadow-xl border">
        <h1 className="text-xl font-bold mb-4">Natillera Individual</h1>
        <p className="text-[10px] text-gray-400 uppercase font-bold">
          Dirección del Contrato:
        </p>
        <p className="text-xs font-mono bg-gray-50 p-3 rounded-xl break-all mb-6">
          {address}
        </p>

        <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
          Pagar Mi Cuota Actual 💸
        </button>
      </div>
    </div>
  );
}
