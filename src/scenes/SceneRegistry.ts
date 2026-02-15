import type { Scene } from './Scene';
import { BouncingShapes } from './BouncingShapes';

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
];
