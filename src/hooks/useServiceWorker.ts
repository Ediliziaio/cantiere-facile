import { useState, useEffect, useCallback } from "react";

interface SWState {
  needRefresh: boolean;
  offlineReady: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<SWState>({
    needRefresh: false,
    offlineReady: false,
    registration: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { registerSW } = await import("virtual:pwa-register");
        const updateSW = registerSW({
          onNeedRefresh() {
            setState((prev) => ({ ...prev, needRefresh: true }));
          },
          onOfflineReady() {
            setState((prev) => ({ ...prev, offlineReady: true }));
          },
          onRegisteredSW(swUrl, registration) {
            if (registration) {
              setState((prev) => ({ ...prev, registration }));
            }
          },
        });
        // Store updateSW for later use
        (window as any).__pwaUpdateSW = updateSW;
      } catch {
        // PWA not available (dev mode or unsupported)
      }
    };
    init();
  }, []);

  const updateServiceWorker = useCallback(() => {
    const updateSW = (window as any).__pwaUpdateSW;
    if (updateSW) {
      updateSW(true);
    }
  }, []);

  const dismissRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, needRefresh: false }));
  }, []);

  const dismissOfflineReady = useCallback(() => {
    setState((prev) => ({ ...prev, offlineReady: false }));
  }, []);

  return {
    ...state,
    updateServiceWorker,
    dismissRefresh,
    dismissOfflineReady,
  };
}
