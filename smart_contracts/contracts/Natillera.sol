interface ISelf {
    function isVerified(address user) external view returns (bool);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Natillera is ReentrancyGuard {
    // --- Configuración de Bounties ---
    address public selfIdentity; // Track SELF
    IERC20 public moneda; // Track Mento (cUSD / cCOP)

    // --- Configuración del Grupo (Contexto Natillera) ---
    address public admin;
    uint256 public montoCuotaBase;
    uint256 public frecuenciaSegundos; // Semanal, Quincenal, etc.
    uint256 public totalCuotasProgramadas;
    uint256 public fechaInicio;
    uint256 public montoMulta;

    struct Socio {
        uint256 saldoAhorrado;
        uint256 totalMultasPagadas;
        uint256 ultimaCuotaPagada; // Número de la cuota (1, 2, 3...)
    }

    mapping(address => Socio) public socios;

    constructor(
        address _moneda,
        uint256 _cuotaBase,
        uint256 _frecuencia,
        uint256 _numCuotas,
        address _self
    ) {
        admin = msg.sender;
        moneda = IERC20(_moneda);
        montoCuotaBase = _cuotaBase;
        frecuenciaSegundos = _frecuencia;
        totalCuotasProgramadas = _numCuotas;
        selfIdentity = _self;
        fechaInicio = block.timestamp;
    }

    // Interfaz para hablar con tu contrato de Self

    // Dentro de tu contrato Natillera:
    function pagarCuota(uint256 _monto) external nonReentrant {
        // REGLA DE ORO (Bounty SELF): Solo humanos verificados entran
        require(
            ISelf(selfIdentity).isVerified(msg.sender),
            "Debes verificar tu identidad con Self"
        );

        require(_monto >= montoCuotaBase, "Monto insuficiente");
        require(_monto % montoCuotaBase == 0, "Debe ser multiplo");

        require(
            moneda.transferFrom(msg.sender, address(this), _monto),
            "Fallo cUSD"
        );
        socios[msg.sender].saldoAhorrado += _monto;
    }

    // Regla: No son responsables de dineros, el contrato es la contabilidad
    function liquidacionDiciembre() external nonReentrant {
        uint256 fechaFin = fechaInicio +
            (totalCuotasProgramadas * frecuenciaSegundos);
        require(block.timestamp >= fechaFin, "Aun no es diciembre");

        uint256 total = socios[msg.sender].saldoAhorrado;
        socios[msg.sender].saldoAhorrado = 0;

        require(moneda.transfer(msg.sender, total), "Fallo transferencia");
    }
}
