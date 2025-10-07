// Google Analytics 4 Configuration
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Substitua pelo seu ID do Google Analytics

// Função para inicializar o Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Carregar o script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Configurar o gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Função para rastrear eventos de conversão
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      ...parameters
    });
  }
};

// Eventos específicos para o portfólio
export const trackPortfolioEvents = {
  // Rastrear cliques no botão WhatsApp
  whatsappClick: (section: string) => {
    trackEvent('whatsapp_click', {
      event_category: 'contact',
      event_label: section,
      value: 1
    });
  },

  // Rastrear visualizações de projetos
  projectView: (projectName: string) => {
    trackEvent('project_view', {
      event_category: 'portfolio',
      event_label: projectName,
      value: 1
    });
  },

  // Rastrear envio de formulário
  formSubmit: (formType: string) => {
    trackEvent('form_submit', {
      event_category: 'lead_generation',
      event_label: formType,
      value: 1
    });
  },

  // Rastrear cliques em CTAs
  ctaClick: (ctaText: string, section: string) => {
    trackEvent('cta_click', {
      event_category: 'conversion',
      event_label: `${section}_${ctaText}`,
      value: 1
    });
  },

  // Rastrear tempo na página
  timeOnPage: (timeInSeconds: number) => {
    trackEvent('time_on_page', {
      event_category: 'engagement',
      event_label: 'portfolio',
      value: timeInSeconds
    });
  },

  // Rastrear scroll depth
  scrollDepth: (percentage: number) => {
    trackEvent('scroll_depth', {
      event_category: 'engagement',
      event_label: 'portfolio',
      value: percentage
    });
  }
};

// Função para rastrear conversões
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', {
    event_category: 'business',
    event_label: conversionType,
    value: value || 1
  });
};

// Declaração global para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
