// src/components/FloatingWidget/LojasModal.jsx
import React from 'react';
import './LojasModal.css';

const lojas = [
  { nome: 'Montes Claros', endereco: 'Av. Santos Dumont, 119 - Centro, Montes Claros - MG, 39400-061', telefone: '0800 038 9004', horario: 'Seg-Sex: 8h às 18h | Sáb: 8h às 12h' },
  { nome: 'Curvelo', endereco: 'R. Pref. Irineu M. Gonzaga, 43 - Centro, Curvelo - MG, 35790-264', telefone: '0800 038 9004', horario: 'Seg-Sex: 8h às 18h | Sáb: 8h às 12h' },
  { nome: 'Porteirinha', endereco: 'CA - PRAÇA CORONEL ODIOLON COELHO 342 - Centro, Porteirinha - MG, 39520-000', telefone: '0800 038 9004', horario: 'Seg-Sex: 8h às 18h | Sáb: 8h às 12h' },
  { nome: 'Janaúba', endereco: 'Av. Manoel Athaide, 149 - São Gonçalo, Janaúba - MG, 39440-000', telefone: '0800 038 9004', horario: 'Seg-Sex: 8h às 18h | Sáb: 8h às 12h' },
];

const LojasModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lojas-modal-overlay" onClick={onClose}>
      <div className="lojas-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lojas-modal-close" onClick={onClose}>✕</button>

        <div className="lojas-modal-header">
          <h3>Nossas Lojas</h3>
          <p>Encontre a unidade Mell Internet mais próxima de você</p>
        </div>

        <div className="lojas-grid">
          {lojas.map((loja) => (
            <div key={loja.nome} className="loja-card">
              <h4>{loja.nome}</h4>
              <p className="loja-endereco">{loja.endereco}</p>
              <p className="loja-info">📞 {loja.telefone}</p>
              <p className="loja-info">🕒 {loja.horario}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LojasModal;