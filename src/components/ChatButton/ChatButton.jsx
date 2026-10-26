import React, { useState } from 'react';
import './ChatButton.css';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Janela do Chat (Iframe) */}
      {isChatOpen && (
        <div className="chat-window-container">
          <div className="chat-window-header">
            <span>Atendimento Online</span>
            <button onClick={toggleChat} className="btn-close-chat">&times;</button>
          </div>
          <iframe
            src="https://mellinternet.atenderbem.com/webchat/getv2?q=75"
            title="Chat de Atendimento"
            frameBorder="0"
            allow="microphone; camera; autoplay; clipboard-write"
            className="chat-iframe"
          ></iframe>
        </div>
      )}

      {/* Botão Flutuante (Só aparece se o chat estiver FECHADO) */}
      {!isChatOpen && (
        <button 
          className="btn-chat-flutuante" 
          onClick={toggleChat}
          aria-label="Abrir chat de atendimento"
          title="Fale conosco pelo Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff">
            <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
          </svg>
          <span className="chat-pulse"></span>
        </button>
      )}
    </>
  );
};

export default ChatButton;