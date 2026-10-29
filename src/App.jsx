import React from "react";
import "./App.css";

// Importação dos componentes da aplicação
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
//import ConsultaPlano from "./components/ConsultaPlano/ConsultaPlano";
import Planos from "./components/Planos/Planos";
import Ecossistema from "./components/Ecossistema/Ecossistema";
import CtaEndereco from "./components/CtaEndereco/CtaEndereco";
// import CidadesAtendidas from "./components/CidadesAtendidas/CidadesAtendidas";
import QuemSomos from "./components/QuemSomos/QuemSomos";
import Faq from "./components/Faq/Faq";
import Footer from "./components/Footer/Footer";
import FloatingWidget from "./components/FloatingWidget/FloatingWidget";

// ⭐ IMPORTANDO O BOTÃO DO CHAT
import ChatButton from "./components/ChatButton/ChatButton";

// ⭐ CONTEXT E MODAL DE VIABILIDADE (compartilhado entre Hero e Ecossistema)
import { ViabilidadeProvider } from "./context/ViabilidadeContext";
import ViabilidadeModal from "./components/ViabilidadeModal/ViabilidadeModal";

import { useOmniChat } from "./hooks/useOmniChat";

function App() {
  // Inicializa o OmniChat globalmente (sem mostrar botão automático)
  useOmniChat(null);

  return (
    <ViabilidadeProvider>
      <div className="App">
        <Navbar />
        <Hero />
        <Planos />
        <Ecossistema />
        {/*<ConsultaPlano />*/}
        <CtaEndereco />
        {/*<CidadesAtendidas /> */}
        <QuemSomos />
        <Faq />
        <Footer />

        {/* Widget de Meus Dados (Direita) */}
        <FloatingWidget />

        {/* ⭐ Botão Exclusivo do Chat (Esquerda) */}
        <ChatButton />

        {/* ⭐ Modal de Viabilidade global (usado pelo Hero e pelo Ecossistema) */}
        <ViabilidadeModal />
      </div>
    </ViabilidadeProvider>
  );
}

export default App;