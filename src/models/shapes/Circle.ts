import { Container } from 'pixi.js';
import { Shape, type RenderContext } from './Shape';

export class Circle extends Shape {
  radius: number;

  constructor(stage: Container, radius = 50) {
    super(stage);
    this.radius = radius;
  }

  setRadius(r: number): this {
    this.radius = r;
    this.render();
    return this;
  }

  getBoundingRadius(): number {
    return this.radius;
  }

  draw(context: RenderContext): void {
    this.graphic.circle(0, 0, this.radius);
    this.graphic.fill(context.fillColor);

    if (context.strokeWidth > 0 && context.strokeColor != null) {
      this.graphic.stroke({ width: context.strokeWidth, color: context.strokeColor });
    }
  }
}
