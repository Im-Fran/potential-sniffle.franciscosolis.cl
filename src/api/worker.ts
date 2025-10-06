import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar el worker de MSW
export const worker = setupWorker(...handlers);

// Función para inicializar MSW
export async function initMSW() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🔥 MSW habilitado para desarrollo');
  } catch (error) {
    console.error('Error al inicializar MSW:', error);
  }
}
