"use client";

import { useReadContract, useAccount } from "wagmi";
import { FACTORY_ADDRESS } from "@/utils/constants";
import factoryAbi from "@/utils/abis/NatilleraFactory.json";
import Link from "next/link";

export default function NatilleraList() {
  const { address } = useAccount(); // Obtiene la dirección de la wallet conectada

  // 1. Leemos del contrato Factory el array de direcciones de natilleras del usuario
  const {
    data: natilleras,
    isLoading,
    //isError,
  } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: factoryAbi,
    functionName: "getNatillerasDeUsuario", // Verifica que este nombre coincida con tu .sol
    args: [address],
  });

  if (!address)
    return (
      <p className="text-center text-gray-500">
        Conecta tu wallet para ver tus natilleras.
      </p>
    );
  if (isLoading)
    return (
      <p className="text-center animate-pulse">Cargando tus natilleras...</p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {natilleras && (natilleras as string[]).length > 0 ? (
        (natilleras as string[]).map((natilleraAddr) => (
          <Link
            key={natilleraAddr}
            href={`/natillera/${natilleraAddr}`}
            className="p-4 bg-white border border-blue-100 rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-mono">
                  {natilleraAddr}
                </p>
                <h3 className="font-bold text-blue-900">Natillera Celo</h3>
              </div>
              <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-center text-gray-400 col-span-2">
          Aún no has creado ninguna natillera.
        </p>
      )}
    </div>
  );
}
