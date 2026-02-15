import { Scene } from './Scene';
import { Circle } from '../models/shapes/Circle';
import { Rectangle } from '../models/shapes/Rectangle';
import { Triangle } from '../models/shapes/Triangle';
import { BorderDecorator } from '../models/decorators/BorderDecorator';
import { OpacityDecorator } from '../models/decorators/OpacityDecorator';
import { GlowDecorator } from '../models/decorators/GlowDecorator';
import { FillDecorator } from '../models/decorators/FillDecorator';
import type { Shape } from '../models/shapes/Shape';

const COLORS = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa29bfe, 0xfd79a8];

export class BouncingShapes extends Scene {
  private shapes: Shape[] = [];

  protected onSetup(): void {
    const stage = this.manager.stage;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create circles
    for (let i = 0; i < 6; i++) {
      const circle = new Circle(stage, 15 + Math.random() * 25);
      circle
        .setPosition(Math.random() * w, Math.random() * h)
        .setFill(COLORS[i % COLORS.length]);
      circle.vx = (Math.random() - 0.5) * 4;
      circle.vy = (Math.random() - 0.5) * 4;
      if (i % 2 === 0) circle.addDecorator(new BorderDecorator(0xffffff, 2));
      circle.addToStage();
      circle.render();
      this.shapes.push(circle);
    }

    // Create rectangles
    for (let i = 0; i < 5; i++) {
      const rect = new Rectangle(stage, 40 + Math.random() * 60, 30 + Math.random() * 40);
      rect
        .setPosition(Math.random() * w, Math.random() * h)
        .setFill(COLORS[(i + 2) % COLORS.length]);
      rect.vx = (Math.random() - 0.5) * 3;
      rect.vy = (Math.random() - 0.5) * 3;
      if (i === 0) rect.addDecorator(new GlowDecorator(0x4ecdc4, 4));
      if (i === 1) rect.addDecorator(new OpacityDecorator(0.6));
      rect.addToStage();
      rect.render();
      this.shapes.push(rect);
    }

    // Create triangles
    for (let i = 0; i < 4; i++) {
      const tri = new Triangle(stage, 30 + Math.random() * 40);
      tri
        .setPosition(Math.random() * w, Math.random() * h)
        .setFill(COLORS[(i + 4) % COLORS.length]);
      tri.vx = (Math.random() - 0.5) * 3.5;
      tri.vy = (Math.random() - 0.5) * 3.5;
      if (i === 0) tri.addDecorator(new BorderDecorator(0xffe66d, 3));
      tri.addToStage();
      tri.render();
      this.shapes.push(tri);
    }

    // Animation loop - move shapes
    this.addTicker(() => {
      // Move all shapes
      for (const shape of this.shapes) {
        shape.x += shape.vx;
        shape.y += shape.vy;

        if (shape.x < 0 || shape.x > w) shape.vx *= -1;
        if (shape.y < 0 || shape.y > h) shape.vy *= -1;
      }

      // Collision detection — check each pair once
      for (let i = 0; i < this.shapes.length; i++) {
        for (let j = i + 1; j < this.shapes.length; j++) {
          const a = this.shapes[i];
          const b = this.shapes[j];
          if (a.intersects(b)) {
            const tmpVx = a.vx;
            const tmpVy = a.vy;
            a.vx = b.vx;
            a.vy = b.vy;
            b.vx = tmpVx;
            b.vy = tmpVy;
            // Separate so they don't re-collide next frame
            a.x += a.vx;
            a.y += a.vy;
            b.x += b.vx;
            b.y += b.vy;
          }
        }
      }

      // Render all shapes
      for (const shape of this.shapes) {
        shape.render();
      }
    });

    // On every "beat", randomly swap a fill color on one shape
    this.onTiming('beat', () => {
      const idx = Math.floor(Math.random() * this.shapes.length);
      const shape = this.shapes[idx];
      const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      shape.removeDecoratorByType(FillDecorator);
      shape.addDecorator(new FillDecorator(newColor));
    });
  }

  protected onDestroy(): void {
    for (const shape of this.shapes) {
      shape.destroy();
    }
    this.shapes = [];
  }
}
