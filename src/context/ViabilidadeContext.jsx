import React, { createContext, useContext, useState } from 'react';

const ViabilidadeContext = createContext();

export const ViabilidadeProvider = ({ children }) => {
  const [showViabilidadeModal, setShowViabilidadeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [consultaFeita, setConsultaFeita] = useState(false);
  const [formData, setFormData] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const resetModal = () => {
    setResultado(null);
    setErro('');
    setConsultaFeita(false);
    setLoading(false);
  };

  const abrirModal = () => {
    resetModal();
    setShowViabilidadeModal(true);
  };

  const fecharModal = () => {
    setShowViabilidadeModal(false);
    resetModal();
  };

  return (
    <ViabilidadeContext.Provider
      value={{
        showViabilidadeModal,
        setShowViabilidadeModal,
        loading,
        setLoading,
        resultado,
        setResultado,
        erro,
        setErro,
        consultaFeita,
        setConsultaFeita,
        formData,
        setFormData,
        resetModal,
        abrirModal,
        fecharModal,
      }}
    >
      {children}
    </ViabilidadeContext.Provider>
  );
};

export const useViabilidade = () => {
  const ctx = useContext(ViabilidadeContext);
  if (!ctx) throw new Error('useViabilidade deve ser usado dentro de ViabilidadeProvider');
  return ctx;
};