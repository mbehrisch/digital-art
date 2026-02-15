import { Container } from 'pixi.js';
import { Shape, type RenderContext } from './Shape';

export class Hexagon extends Shape {
  radius: number;

  constructor(stage: Container, radius = 30) {
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
    // Pointy-top hexagon: vertices at i * 60° - 30°
    const points: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(
        Math.cos(angle) * this.radius,
        Math.sin(angle) * this.radius,
      );
    }

    this.graphic.poly(points);
    this.graphic.fill(context.fillColor);

    if (context.strokeWidth > 0 && context.strokeColor != null) {
      this.graphic.stroke({ width: context.strokeWidth, color: context.strokeColor });
    }
  }
}
