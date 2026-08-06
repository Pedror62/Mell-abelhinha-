import React, { useEffect } from 'react';
import './ChatWidget.css';

export const ChatWidget = () => {
  useEffect(() => {
    // Configurações globais exigidas pelo AtenderBem
    window.omniChatQueueId = 60;
    window.omniChatDomain = 'mellinternet.atenderbem.com';

    const existingScript = document.querySelector('script[src*="wbchat.min.js"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'module';
      script.async = true;
      script.src = 'https://statics.atenderbem.com/js/wbchat.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return null; // O script injeta o botão nativamente na página
};

export default ChatWidget;