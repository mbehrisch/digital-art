import type { RenderContext } from '../shapes/Shape';

export abstract class ShapeDecorator {
  abstract apply(context: RenderContext): RenderContext;
}
