import React from 'react';
import './RegulamentosModal.css';

export const RegulamentosModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Exemplo da lista de contratos/regulamentos
  const contratos = [
    { id: 1, titulo: 'Contrato de Prestação de Serviços de Internet (SCM)', link: '#' },
    { id: 2, titulo: 'Termo de Adesão e Aceite de Planos', link: '#' },
    { id: 3, titulo: 'Política de Privacidade e Proteção de Dados (LGPD)', link: '#' },
    { id: 4, titulo: 'Regulamento de Promoções Vigentes', link: '#' },
    { id: 5, titulo: 'Contrato de SMOD (Serviços de Valor Adicionado)', link: '#' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Regulamentos e Contratos</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Confira abaixo a documentação e os termos regulamentares da Mell Internet:
          </p>
          <ul className="contratos-list">
            {contratos.map((doc) => (
              <li key={doc.id} className="contrato-item">
                <span className="contrato-titulo">{doc.titulo}</span>
                <a href={doc.link} target="_blank" rel="noopener noreferrer" className="btn-download">
                  Visualizar PDF
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegulamentosModal;