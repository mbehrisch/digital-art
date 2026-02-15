import type { RenderContext } from '../shapes/Shape';
import { ShapeDecorator } from './ShapeDecorator';

export class BorderDecorator extends ShapeDecorator {
  color: number;
  width: number;

  constructor(color = 0x000000, width = 2) {
    super();
    this.color = color;
    this.width = width;
  }

  setColor(color: number): this {
    this.color = color;
    return this;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  apply(context: RenderContext): RenderContext {
    return { ...context, strokeColor: this.color, strokeWidth: this.width };
  }
}
