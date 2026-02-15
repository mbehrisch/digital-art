import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CanvasManager, canvasManager } from './CanvasManager';

const CanvasContext = createContext<CanvasManager>(canvasManager);

export function useCanvas(): CanvasManager {
  return useContext(CanvasContext);
}

export function CanvasProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    canvasManager.init(containerRef.current).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CanvasContext.Provider value={canvasManager}>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      />
      {ready && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      )}
    </CanvasContext.Provider>
  );
}
