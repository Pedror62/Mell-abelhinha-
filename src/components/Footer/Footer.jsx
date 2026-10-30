// src/components/Footer/Footer.jsx
import React, { useState } from 'react';
import './Footer.css';
import logoMell from '../../assets/logoMell.png';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaPhoneAlt, FaBarcode } from 'react-icons/fa';
import RegulamentosModal from '../RegulamentosModal/RegulamentosModal';
import BoletoModal from '../BoletoModal/BoletoModal';
import InstitucionalModal from '../InstitucionalModal/InstitucionalModal'; // Importação correta

export const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoletoModalOpen, setIsBoletoModalOpen] = useState(false);
  const [isInstitucionalModalOpen, setIsInstitucionalModalOpen] = useState(false);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Coluna 1: Logo */}
          <div className="footer-col brand-col">
            <img src={logoMell} alt="Mell Sempre Feliz" className="logo-img" />
            <p className="footer-description">
              Internet, benefícios e atendimento para conectar o Norte de Minas.
            </p>
          </div>

          {/* Coluna 2: Institucional*/}
          <div className="footer-col">
            <h4 className="footer-title">Institucional</h4>
            <ul className="footer-links">
              {/*
              <li>
                <a 
                  href="#institucional" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsInstitucionalModalOpen(true);
                  }}
                >
                  Quem somos
                </a>
              </li>
              <li><a href="#trabalhe-conosco">Trabalhe conosco</a></li>
              */}
              <li>
                <a 
                  href="#regulamentos" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                >
                  Regulamentos
                </a>
              </li>
            </ul>
          </div> 

          {/* Coluna 3: Atendimento */}
          <div className="footer-col">
            <h4 className="footer-title">Atendimento</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="#2a-via-boleto" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsBoletoModalOpen(true);
                  }}
                  className="link-destaque-boleto"
                >
                  <FaBarcode className="link-icon" /> 2ª Via de Boleto
                </a>
              </li>
              <li><a href="https://wa.me/5538999999999"><FaWhatsapp className="link-icon" /> WhatsApp</a></li>
              <li><a href="tel:08000000000"><FaPhoneAlt className="link-icon" /> Ligação 24h</a></li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div className="footer-col">
            <h4 className="footer-title">Redes sociais</h4>
            <div className="social-brands">
              <a href="https://instagram.com" className="social-badge"><FaInstagram /> Instagram</a>
              <a href="https://facebook.com" className="social-badge"><FaFacebookF /> Facebook</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Mell Internet. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Modais */}
      <RegulamentosModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <BoletoModal 
        isOpen={isBoletoModalOpen} 
        onClose={() => setIsBoletoModalOpen(false)} 
      />

      <InstitucionalModal 
        isOpen={isInstitucionalModalOpen} 
        onClose={() => setIsInstitucionalModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;