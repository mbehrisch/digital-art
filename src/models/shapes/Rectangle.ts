import { Container } from 'pixi.js';
import { Shape, type RenderContext } from './Shape';

export class Rectangle extends Shape {
  width: number;
  height: number;

  constructor(stage: Container, width = 100, height = 100) {
    super(stage);
    this.width = width;
    this.height = height;
  }

  setSize(w: number, h: number): this {
    this.width = w;
    this.height = h;
    this.render();
    return this;
  }

  getBoundingRadius(): number {
    return Math.sqrt(this.width * this.width + this.height * this.height) / 2;
  }

  draw(context: RenderContext): void {
    this.graphic.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.graphic.fill(context.fillColor);

    if (context.strokeWidth > 0 && context.strokeColor != null) {
      this.graphic.stroke({ width: context.strokeWidth, color: context.strokeColor });
    }
  }
}
