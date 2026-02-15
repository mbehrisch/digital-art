import { Container } from 'pixi.js';
import { Shape, type RenderContext } from './Shape';

export class Line extends Shape {
  thickness: number;
  private halfDx = 0;
  private halfDy = 0;
  private fromShape: Shape | null = null;
  private toShape: Shape | null = null;

  constructor(stage: Container, thickness = 2) {
    super(stage);
    this.thickness = thickness;
  }

  /** Define the line by two absolute points. Clears any shape binding. */
  setPoints(x1: number, y1: number, x2: number, y2: number): this {
    this.fromShape = null;
    this.toShape = null;
    this.x = (x1 + x2) / 2;
    this.y = (y1 + y2) / 2;
    this.halfDx = (x2 - x1) / 2;
    this.halfDy = (y2 - y1) / 2;
    return this;
  }

  /** Bind the line between two shapes. Endpoints track them automatically. */
  between(from: Shape, to: Shape): this {
    this.fromShape = from;
    this.toShape = to;
    this.syncFromShapes();
    return this;
  }

  private syncFromShapes(): void {
    if (!this.fromShape || !this.toShape) return;
    const x1 = this.fromShape.x, y1 = this.fromShape.y;
    const x2 = this.toShape.x, y2 = this.toShape.y;
    this.x = (x1 + x2) / 2;
    this.y = (y1 + y2) / 2;
    this.halfDx = (x2 - x1) / 2;
    this.halfDy = (y2 - y1) / 2;
  }

  /** true when this line is bound between two shapes. */
  get isBound(): boolean {
    return this.fromShape !== null && this.toShape !== null;
  }

  get from(): Shape | null { return this.fromShape; }
  get to(): Shape | null { return this.toShape; }

  get x1(): number { return this.x - this.halfDx; }
  get y1(): number { return this.y - this.halfDy; }
  get x2(): number { return this.x + this.halfDx; }
  get y2(): number { return this.y + this.halfDy; }

  get length(): number {
    return Math.sqrt(this.halfDx * this.halfDx + this.halfDy * this.halfDy) * 2;
  }

  setThickness(thickness: number): this {
    this.thickness = thickness;
    return this;
  }

  getBoundingRadius(): number {
    return this.length / 2;
  }

  render(): void {
    this.syncFromShapes();
    super.render();
  }

  draw(context: RenderContext): void {
    // Stroke decorator (border / glow) drawn as a thicker line behind
    if (context.strokeWidth > 0 && context.strokeColor != null) {
      this.graphic.moveTo(-this.halfDx, -this.halfDy);
      this.graphic.lineTo(this.halfDx, this.halfDy);
      this.graphic.stroke({
        width: this.thickness + context.strokeWidth * 2,
        color: context.strokeColor,
      });
    }

    // Main line
    this.graphic.moveTo(-this.halfDx, -this.halfDy);
    this.graphic.lineTo(this.halfDx, this.halfDy);
    this.graphic.stroke({ width: this.thickness, color: context.fillColor });
  }
}
