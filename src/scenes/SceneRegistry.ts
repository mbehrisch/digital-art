import type { Scene } from './Scene';
import { BouncingShapes } from './BouncingShapes';
import { HexagonGrid } from './HexagonGrid';

export interface SceneEntry {
  id: string;
  name: string;
  description: string;
  color: string;
  create: () => Scene;
}

export const sceneRegistry: SceneEntry[] = [
  {
    id: 'bouncing-shapes',
    name: 'Bouncing Shapes',
    description: 'Circles, rectangles & triangles bouncing with decorators',
    color: '#ff6b6b',
    create: () => new BouncingShapes(),
  },
  {
    id: 'hexagon-grid',
    name: 'Hexagon Grid',
    description: 'Honeycomb color waves with ripple pulses',
    color: '#21918c',
    create: () => new HexagonGrid(),
  },
];
