import React from "react";
import "./App.css";

// Importação dos componentes da aplicação
import Navbar from "./components/Navbar/Navbar";
// import Sidebar from "./components/Sidebar/Sidebar"; // Reservado para futura implementação
import Hero from "./components/Hero/Hero";
import ConsultaPlano from "./components/ConsultaPlano/ConsultaPlano";
import Planos from "./components/Planos/Planos";
import Ecossistema from "./components/Ecossistema/Ecossistema";
import CtaEndereco from "./components/CtaEndereco/CtaEndereco";
import CidadesAtendidas from "./components/CidadesAtendidas/CidadesAtendidas";
import QuemSomos from "./components/QuemSomos/QuemSomos";
import Faq from "./components/Faq/Faq";
import Footer from "./components/Footer/Footer";
import FloatingWidget from "./components/FloatingWidget/FloatingWidget";


function App() {
  return (
    <div className="App">
      {/* Cabeçalho e Navegação */}
      <Navbar />
      {/* <Sidebar /> */}

      {/* Seção Principal / Banner Hero */}
      <Hero />

      {/* Consultas e Ofertas */}
      <Planos />
      <Ecossistema />
      <ConsultaPlano />

      <CtaEndereco />

      {/* Ecossistema e Cidades */}
      <CidadesAtendidas />

      {/* Sobre e Perguntas Frequentes */}
      <QuemSomos />
      <Faq />

      {/* Rodapé */}
      <Footer />

      {/* Widget Flutuante Unificado (Disponível Globalmente) */}
      <FloatingWidget />
     
    </div>
  );
}

export default App;