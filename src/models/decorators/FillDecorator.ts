import type { RenderContext } from '../shapes/Shape';
import { ShapeDecorator } from './ShapeDecorator';

export class FillDecorator extends ShapeDecorator {
  color: number;

  constructor(color = 0xffffff) {
    super();
    this.color = color;
  }

  setColor(color: number): this {
    this.color = color;
    return this;
  }

  apply(context: RenderContext): RenderContext {
    return { ...context, fillColor: this.color };
  }
}
