"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { parseEther } from "viem";
import { FACTORY_ADDRESS, CUSD_ADDRESS } from "@/utils/constants";
import factoryAbi from "@/utils/abis/NatilleraFactory.json";

export default function CreateNatilleraForm() {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [nombre, setNombre] = useState("");
  const [cuota, setCuota] = useState("");
  const [numCuotas, setNumCuotas] = useState("12");
  const [frecuencia, setFrecuencia] = useState("604800");

  const handleCreate = async () => {
    if (!wallet) return alert("Conecta tu wallet primero");

    // Cambiamos a Celo Sepolia (ID 11142220) antes de enviar
    try {
      await wallet.switchChain(11142220);

      writeContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: factoryAbi,
        functionName: "crearNatillera",
        args: [
          nombre,
          CUSD_ADDRESS,
          parseEther(cuota || "0"),
          BigInt(frecuencia),
          BigInt(numCuotas),
          wallet.address as `0x${string}`,
        ],
      });
    } catch (err) {
      console.error("Error al cambiar de red:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-md border border-gray-100 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 text-blue-900 text-center">
        Nueva Natillera
      </h2>

      <div className="space-y-3">
        <input
          placeholder="Nombre del grupo"
          className="w-full p-3 border rounded-xl text-black bg-gray-50 outline-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Cuota (cUSD)"
          type="number"
          className="w-full p-3 border rounded-xl text-black bg-gray-50 outline-none"
          value={cuota}
          onChange={(e) => setCuota(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="w-full p-3 border rounded-xl text-black bg-gray-50"
            value={numCuotas}
            onChange={(e) => setNumCuotas(e.target.value)}
          />
          <select
            className="w-full p-3 border rounded-xl text-black bg-gray-50 font-bold"
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
          >
            <option value="604800">Semanal</option>
            <option value="1209600">Quincenal</option>
            <option value="2592000">Mensual</option>
          </select>
        </div>
      </div>

      <button
        disabled={isPending || isConfirming || !wallet || !nombre || !cuota}
        onClick={handleCreate}
        className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:bg-gray-300 transition-colors shadow-lg"
      >
        {isPending || isConfirming
          ? "Procesando en Celo..."
          : "Lanzar Natillera 🚀"}
      </button>

      {isSuccess && (
        <p className="mt-3 text-green-600 text-sm font-medium text-center bg-green-50 p-2 rounded-lg">
          ¡Natillera creada con éxito! 🎉
        </p>
      )}
      {hash && (
        <div className="mt-4 text-center">
          <a
            href={`https://celo-sepolia.blockscout.com/tx/${hash}`}
            target="_blank"
            className="text-blue-500 underline text-xs"
          >
            Ver transacción en Explorer ↗
          </a>
        </div>
      )}

      {error && (
        <p className="mt-3 text-red-500 text-[10px] break-all text-center bg-red-50 p-2 rounded-lg">
          Error: {error.message.split("\n")[0]}
        </p>
      )}
    </div>
  );
}
