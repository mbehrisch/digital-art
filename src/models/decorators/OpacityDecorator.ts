import type { RenderContext } from '../shapes/Shape';
import { ShapeDecorator } from './ShapeDecorator';

export class OpacityDecorator extends ShapeDecorator {
  alpha: number;

  constructor(alpha = 1.0) {
    super();
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  setAlpha(alpha: number): this {
    this.alpha = Math.max(0, Math.min(1, alpha));
    return this;
  }

  apply(context: RenderContext): RenderContext {
    return { ...context, opacity: context.opacity * this.alpha };
  }
}
