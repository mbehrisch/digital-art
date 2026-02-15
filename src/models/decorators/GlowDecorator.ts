import type { RenderContext } from '../shapes/Shape';
import { ShapeDecorator } from './ShapeDecorator';

export class GlowDecorator extends ShapeDecorator {
  color: number;
  intensity: number;

  constructor(color = 0xffff00, intensity = 8) {
    super();
    this.color = color;
    this.intensity = intensity;
  }

  setColor(color: number): this {
    this.color = color;
    return this;
  }

  setIntensity(intensity: number): this {
    this.intensity = intensity;
    return this;
  }

  apply(context: RenderContext): RenderContext {
    return { ...context, strokeColor: this.color, strokeWidth: this.intensity };
  }
}
