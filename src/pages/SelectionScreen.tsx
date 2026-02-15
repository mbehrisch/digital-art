import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sceneRegistry } from '../scenes/SceneRegistry';

const AUTO_LOAD_DELAY = 6000;
const BORDER_RADIUS = 16;

function TimerBorder({ durationMs }: { durationMs: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect) return;

    const parent = svg.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);

    const r = BORDER_RADIUS;
    rect.setAttribute('x', '1');
    rect.setAttribute('y', '1');
    rect.setAttribute('width', `${width - 2}`);
    rect.setAttribute('height', `${height - 2}`);
    rect.setAttribute('rx', `${r}`);
    rect.setAttribute('ry', `${r}`);

    const perimeter = 2 * (width - 2 + height - 2) - 8 * r + 2 * Math.PI * r;
    rect.style.strokeDasharray = `${perimeter}`;
    rect.style.strokeDashoffset = `${perimeter}`;
    rect.style.animation = `dash-fill ${durationMs}ms linear forwards`;
  }, [durationMs]);

  return (
    <svg
      ref={svgRef}
      className="timer-border-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect ref={rectRef} className="timer-border-rect" />
    </svg>
  );
}

export function SelectionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstVisit = !location.state?.fromScene;
  const [showHint, setShowHint] = useState(isFirstVisit);

  useEffect(() => {
    if (isFirstVisit && sceneRegistry.length > 0) {
      timerRef.current = setTimeout(() => {
        navigate(`/scene/${sceneRegistry[0].id}`);
      }, AUTO_LOAD_DELAY);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate, isFirstVisit]);

  const handleSelect = (id: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowHint(false);
    navigate(`/scene/${id}`);
  };

  return (
    <div className="selection-screen">
      <h1 className="selection-title">Digital Art</h1>
      <p className="selection-subtitle">Choose a scene to explore</p>
      <div className="scene-grid">
        {sceneRegistry.map((entry, index) => (
          <button
            key={entry.id}
            className="scene-card"
            onClick={() => handleSelect(entry.id)}
          >
            {index === 0 && showHint && (
              <TimerBorder durationMs={AUTO_LOAD_DELAY} />
            )}
            <div
              className="scene-card-preview"
              style={{ background: `linear-gradient(135deg, ${entry.color}, ${entry.color}88)` }}
            />
            <div className="scene-card-info">
              <h2>{entry.name}</h2>
              <p>{entry.description}</p>
            </div>
          </button>
        ))}
      </div>
      {showHint && sceneRegistry.length > 0 && (
        <p className="auto-load-hint">
          Auto-loading first scene in {AUTO_LOAD_DELAY / 1000} seconds...
        </p>
      )}
    </div>
  );
}
