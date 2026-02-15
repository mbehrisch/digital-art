import type { RenderContext } from '../shapes/Shape';
import { ShapeDecorator } from './ShapeDecorator';

export class GlowDecorator extends ShapeDecorator {
  color: number;
  intensity: number;
  private durationMs: number;
  private startTime: number;

  /** @param durationMs  Fade-out time in ms. 0 = no fade (permanent glow). */
  constructor(color = 0xffff00, intensity = 8, durationMs = 0) {
    super();
    this.color = color;
    this.intensity = intensity;
    this.durationMs = durationMs;
    this.startTime = performance.now();
  }

  setColor(color: number): this {
    this.color = color;
    return this;
  }

  setIntensity(intensity: number): this {
    this.intensity = intensity;
    return this;
  }

  /** Reset the fade timer so the glow starts fading from full intensity again. */
  restart(): this {
    this.startTime = performance.now();
    return this;
  }

  /** true when the fade-out is complete and this decorator has no visible effect. */
  get expired(): boolean {
    return this.durationMs > 0 && performance.now() - this.startTime >= this.durationMs;
  }

  apply(context: RenderContext): RenderContext {
    if (this.durationMs <= 0) {
      return { ...context, strokeColor: this.color, strokeWidth: this.intensity };
    }

    const elapsed = performance.now() - this.startTime;
    const t = Math.min(elapsed / this.durationMs, 1);
    const currentIntensity = this.intensity * (1 - t);

    if (currentIntensity <= 0) return context;
    return { ...context, strokeColor: this.color, strokeWidth: currentIntensity };
  }
}
