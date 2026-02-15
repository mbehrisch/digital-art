import { Container } from 'pixi.js';
import { Shape, type RenderContext } from './Shape';

export class Triangle extends Shape {
  size: number;

  constructor(stage: Container, size = 60) {
    super(stage);
    this.size = size;
  }

  setSize(s: number): this {
    this.size = s;
    this.render();
    return this;
  }

  getBoundingRadius(): number {
    return (this.size * Math.sqrt(3)) / 3;
  }

  draw(context: RenderContext): void {
    const h = (this.size * Math.sqrt(3)) / 2;
    this.graphic.poly([
      0, -h * (2 / 3),
      -this.size / 2, h / 3,
      this.size / 2, h / 3,
    ]);
    this.graphic.fill(context.fillColor);

    if (context.strokeWidth > 0 && context.strokeColor != null) {
      this.graphic.stroke({ width: context.strokeWidth, color: context.strokeColor });
    }
  }
}
