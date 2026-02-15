import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCanvas } from '../canvas/CanvasProvider';
import { sceneRegistry } from '../scenes/SceneRegistry';
import type { Scene } from '../scenes/Scene';

export function ScenePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvas = useCanvas();
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    const entry = sceneRegistry.find((s) => s.id === id);
    if (!entry) {
      navigate('/');
      return;
    }

    const scene = entry.create();
    scene.setup(canvas);
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, [id, canvas, navigate]);

  return (
    <button className="back-button" onClick={() => navigate('/')}>
      ← Back
    </button>
  );
}
