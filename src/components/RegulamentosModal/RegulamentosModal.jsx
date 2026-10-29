import React from 'react';
import './RegulamentosModal.css';

// Importa dinamicamente todos os PDFs da pasta src/doc
const pdfsImportados = import.meta.glob('/src/doc/*.pdf', {
  eager: true,
  import: 'default',
});

// Mapeia o nome original do arquivo para a URL final gerada pelo Vite
const urlsPorNome = {};
Object.entries(pdfsImportados).forEach(([caminho, url]) => {
  const nome = decodeURIComponent(caminho.split('/').pop()).normalize('NFC');
  urlsPorNome[nome] = url;
});

const obterUrl = (nomeArquivo) => {
  const url = urlsPorNome[nomeArquivo.normalize('NFC')];
  if (!url) {
    console.warn(`PDF não encontrado em src/doc: "${nomeArquivo}"`);
  }
  return url;
};

export const RegulamentosModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Lista com os nomes reais dos arquivos presentes na sua pasta src/doc
  const contratos = [
    { 
      id: 1, 
      titulo: 'CVO - CONTRATO DE COMÉRCIO DE CONTEÚDOS DIGITAIS', 
      data: '14/09/2026', 
      tamanho: '16,2 MB', 
      tipo: 'Contrato', 
      arquivo: 'CVO - CONTRATO_DE_COMÉRCIO_DE_CONTEÚDOS_DIGITAIS.pdf' 
    },
    { 
      id: 2, 
      titulo: 'CVO - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE COMUNICAÇÃO MULTIMÍDIA', 
      data: '14/09/2026', 
      tamanho: '27,8 MB', 
      tipo: 'Contrato', 
      arquivo: 'CVO - CONTRATO_DE_PRESTAÇÃO_DE_SERVIÇOS_DE_COMUNICAÇÃO_MULTIMÍDIA.pdf' 
    },
    { 
      id: 3, 
      titulo: 'CVO - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE VALOR ADICIONADO', 
      data: '14/09/2026', 
      tamanho: '44,3 MB', 
      tipo: 'Contrato', 
      arquivo: 'CVO-CONTRATO_DE_PRESTAÇÃO_DE_SERVIÇOS_DE_VALOR_ADICIONADO.pdf' 
    },
    { 
      id: 4, 
      titulo: 'SCM - CONTRATO DE PRESTAÇÃO DE SERVIÇO TELEFÔNICO FIXO COMUTADO - STFC', 
      data: '14/09/2026', 
      tamanho: '45,5 MB', 
      tipo: 'Contrato', 
      arquivo: 'SCM - CONTRATO DE PRESTAÇÃO DE SERVIÇO TELEFÔNICO FIXO COMUTADO - STFC.pdf' 
    },
    { 
      id: 5, 
      titulo: 'SCM - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE COMUNICAÇÃO MULTIMÍDIA', 
      data: '14/09/2026', 
      tamanho: '48,4 MB', 
      tipo: 'Contrato', 
      arquivo: 'SCM - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE COMUNICAÇÃO MULTIMÍDIA.pdf' 
    },
    { 
      id: 6, 
      titulo: 'SVA - CONTRATO DE COMÉRCIO DE CONTEÚDOS DIGITAIS', 
      data: '14/09/2026', 
      tamanho: '13,9 MB', 
      tipo: 'Contrato', 
      arquivo: 'SVA - CONTRATO DE COMÉRCIO DE CONTEÚDOS DIGITAIS.pdf' 
    },
    { 
      id: 7, 
      titulo: 'SVA - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE VALOR ADICIONADO', 
      data: '14/09/2026', 
      tamanho: '37,6 MB', 
      tipo: 'Contrato', 
      arquivo: 'SVA - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE VALOR ADICIONADO.pdf' 
    },
  ];

  const notas = [
    { 
      id: 8, 
      titulo: 'NOTA DE ALTERAÇÃO DOS PLANOS E/OU COMBOS EXISTENTES', 
      data: '14/09/2026', 
      tamanho: '18,4 MB', 
      tipo: 'Nota', 
      arquivo: 'NOTA DE ALTERAÇÃO DOS PLANOS EOU COMBOS EXISTENTES.pdf' 
    },
  ];

  const abrirNovaAba = (e, nomeArquivo) => {
    e.stopPropagation();
    const url = obterUrl(nomeArquivo);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Documento não encontrado em src/doc.');
    }
  };

  const renderLista = (lista, tituloGrupo) => (
    <div className="regulamentos-categoria">
      <div className="regulamentos-categoria-header">
        <h3 className="regulamentos-categoria-title">
          {tituloGrupo}
          <span className="categoria-count">{lista.length}</span>
        </h3>
      </div>
      
      <div className="regulamentos-categoria-items">
        {lista.map((doc) => (
          <div key={doc.id} className="regulamentos-item">
            <div className="regulamentos-item-left">
              <div className="regulamentos-item-icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path>
                </svg>
              </div>
              <div className="regulamentos-item-details">
                <h4 className="regulamentos-item-title">{doc.titulo}</h4>
                <div className="regulamentos-item-meta">
                  <span className="meta-date">{doc.data}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-size">{doc.tamanho}</span>
                  <span className="regulamentos-item-categoria-tag">{doc.tipo}</span>
                </div>
              </div>
            </div>
            
            <div className="regulamentos-item-actions">
              <button 
                className="btn-visualizar-doc" 
                onClick={(e) => abrirNovaAba(e, doc.arquivo)}
              >
                Visualizar
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="regulamentos-overlay" onClick={onClose}>
      <div className="regulamentos-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="regulamentos-header">
          <div className="regulamentos-header-content">
            <h2 className="regulamentos-title">Regulamentos e Documentos</h2>
            <p className="regulamentos-subtitle">Consulte e visualize os termos oficiais da Mell Internet.</p>
          </div>
          <button className="regulamentos-close" onClick={onClose} aria-label="Fechar">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="regulamentos-content">
          <div className="regulamentos-list">
            {renderLista(contratos, 'Contratos')}
            {renderLista(notas, 'Notas e Comunicados')}
          </div>
        </div>

        <div className="regulamentos-footer">
          <p className="regulamentos-footer-text">Todos os documentos estão em conformidade com a legislação vigente.</p>
          <button className="regulamentos-footer-close" onClick={onClose}>Fechar</button>
        </div>

      </div>
    </div>
  );
};

export default RegulamentosModal;