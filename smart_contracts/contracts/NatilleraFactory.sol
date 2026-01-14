// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Natillera.sol";

contract NatilleraFactory {
    // Lista de todas las natilleras creadas (Contabilidad Global)
    address[] public todasLasNatilleras;
    
    // Evento para que la Web sepa que se creó un grupo nuevo
    event NatilleraCreada(address contratoDireccion, address admin, string nombre);

    function crearNatillera(
        string memory _nombre,
        address _moneda,
        uint256 _cuota,
        uint256 _frecuencia,
        uint256 _numCuotas,
        address _self // Wallet verificada con Self para grupos ajenos a Web3
    ) external {
        // Creamos un nuevo contrato de Natillera real en la Blockchain
        Natillera nueva = new Natillera(
            _moneda,
            _cuota,
            _frecuencia,
            _numCuotas,
            _self
        );
        
        todasLasNatilleras.push(address(nueva));
        
        emit NatilleraCreada(address(nueva), msg.sender, _nombre);
    }

    // Para que la web muestre cuántas natilleras existen
    function totalNatilleras() external view returns (uint256) {
        return todasLasNatilleras.length;
    }
}