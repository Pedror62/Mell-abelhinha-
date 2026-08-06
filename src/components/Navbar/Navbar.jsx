import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logoImg from '../../assets/logoMell.png';

export const Navbar = () => {
  const [showContatoMenu, setShowContatoMenu] = useState(false);
  const dropdownRef = useRef(null);

  const toggleContatoMenu = (e) => {
    e.preventDefault();
    setShowContatoMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowContatoMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenChat = () => {
    setShowContatoMenu(false);
    alert('Abrindo o chat no site...');
  };

  const handleOpenWhatsApp = () => {
    setShowContatoMenu(false);
    window.open('https://wa.me/5538999999999', '_blank');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <a href="#" className="navbar-logo">
          <img src={logoImg} alt="Mell Telecom" />
        </a>

        {/* LINKS */}
        <ul className="navbar-links">
          <li>
            <a href="#quem-somos">Quem Somos</a>
          </li>
          <li>
            <a href="#planos">Planos</a>
          </li>

          {/* CONTATO + POPOVER */}
          <li className="nav-item-contato" ref={dropdownRef}>
            <button 
              className={`nav-link-btn ${showContatoMenu ? 'active' : ''}`}
              onClick={toggleContatoMenu}
              type="button"
            >
              Contato
            </button>

            {showContatoMenu && (
              <div className="popover-balao">
                {/* Seta do balão */}
                <div className="balao-arrow"></div>

                {/* Header com título e botão X */}
                <div className="balao-header">
                  <span>Opções para você</span>
                  <button 
                    type="button" 
                    className="balao-close-btn" 
                    onClick={() => setShowContatoMenu(false)}
                  >
                    &times;
                  </button>
                </div>

                {/* Opções em Cards */}
                <div className="balao-options">
                  <button type="button" className="balao-card" onClick={handleOpenChat}>
                    <div className="balao-card-icon">💬</div>
                    <div className="balao-card-text">
                      <strong>Chat no site</strong>
                      <p>Atendimento online agora</p>
                    </div>
                  </button>

                  <button type="button" className="balao-card" onClick={handleOpenWhatsApp}>
                    <div className="balao-card-icon green">💬</div>
                    <div className="balao-card-text">
                      <strong>Contate pelo WhatsApp</strong>
                      <p>Fale com a equipe agora mesmo</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* BOTÃO ASSINANTE */}
        <a href=  "https://central.mellinternet.com.br/"  target="_blank" rel="noopener noreferrer" className="btn-central-assinante">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          Central do Assinante
        </a>
      </div>
    </nav>
  );
};

export default Navbar;