import { Graphics, Container } from 'pixi.js';
import type { ShapeDecorator } from '../decorators/ShapeDecorator';

export interface RenderContext {
  fillColor: number;
  strokeColor: number | null;
  strokeWidth: number;
  opacity: number;
}

export abstract class Shape {
  graphic: Graphics;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  baseFillColor = 0xffffff;
  baseStrokeColor: number | null = null;
  baseStrokeWidth = 0;
  baseOpacity = 1;
  decorators: ShapeDecorator[] = [];

  private stage: Container;

  constructor(stage: Container) {
    this.stage = stage;
    this.graphic = new Graphics();
  }

  setPosition(x: number, y: number): this {
    this.x = x;
    this.y = y;
    this.graphic.x = x;
    this.graphic.y = y;
    return this;
  }

  setFill(color: number): this {
    this.baseFillColor = color;
    return this;
  }

  setStroke(color: number, width: number): this {
    this.baseStrokeColor = color;
    this.baseStrokeWidth = width;
    return this;
  }

  setOpacity(alpha: number): this {
    this.baseOpacity = Math.max(0, Math.min(1, alpha));
    return this;
  }

  addDecorator(decorator: ShapeDecorator): this {
    this.decorators.push(decorator);
    this.render();
    return this;
  }

  removeDecorator(decorator: ShapeDecorator): this {
    this.decorators = this.decorators.filter(d => d !== decorator);
    this.render();
    return this;
  }

  removeDecoratorByType<T extends ShapeDecorator>(
    DecoratorClass: new (...args: any[]) => T,
  ): this {
    this.decorators = this.decorators.filter(d => !(d instanceof DecoratorClass));
    this.render();
    return this;
  }

  findDecorator<T extends ShapeDecorator>(
    DecoratorClass: new (...args: any[]) => T,
  ): T | undefined {
    return this.decorators.find(d => d instanceof DecoratorClass) as T | undefined;
  }

  clearDecorators(): this {
    this.decorators = [];
    this.render();
    return this;
  }

  addToStage(): this {
    this.stage.addChild(this.graphic);
    return this;
  }

  removeFromStage(): this {
    this.stage.removeChild(this.graphic);
    return this;
  }

  render(): void {
    this.graphic.clear();

    let context: RenderContext = {
      fillColor: this.baseFillColor,
      strokeColor: this.baseStrokeColor,
      strokeWidth: this.baseStrokeWidth,
      opacity: this.baseOpacity,
    };

    for (const decorator of this.decorators) {
      context = decorator.apply(context);
    }

    this.graphic.alpha = context.opacity;
    this.draw(context);
    this.graphic.x = this.x;
    this.graphic.y = this.y;
  }

  abstract draw(context: RenderContext): void;

  /** Radius of the smallest circle enclosing this shape. */
  abstract getBoundingRadius(): number;

  /** Circle-based intersection test between two shapes. */
  intersects(other: Shape): boolean {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dist = this.getBoundingRadius() + other.getBoundingRadius();
    return dx * dx + dy * dy < dist * dist;
  }

  destroy(): void {
    this.removeFromStage();
    this.graphic.destroy();
  }
}
