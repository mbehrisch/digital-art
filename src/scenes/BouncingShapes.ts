import type { Container } from 'pixi.js';
import { Scene } from './Scene';
import { Circle } from '../models/shapes/Circle';
import { Rectangle } from '../models/shapes/Rectangle';
import { Line } from '../models/shapes/Line';
import { BorderDecorator } from '../models/decorators/BorderDecorator';
import { OpacityDecorator } from '../models/decorators/OpacityDecorator';
import { GlowDecorator } from '../models/decorators/GlowDecorator';
import { FillDecorator } from '../models/decorators/FillDecorator';
import type { Shape } from '../models/shapes/Shape';
import { PALETTE, GLOW_WHITE, GLOW_TEAL, GLOW_PURPLE } from '../theme/colors';

const PROXIMITY = 250;

export class BouncingShapes extends Scene {
  private shapes: Shape[] = [];
  private lines: Line[] = [];

  protected onSetup(): void {
    const stage = this.manager.stage;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create circles
    for (let i = 0; i < 20; i++) {
      const circle = new Circle(stage, 15 + Math.random() * 25);
      circle
        .setPosition(Math.random() * w, Math.random() * h)
        .setFill(PALETTE[i % PALETTE.length]);
      circle.vx = (Math.random() - 0.25) * 4;
      circle.vy = (Math.random() - 0.25) * 4;
      if (i % 2 === 0) circle.addDecorator(new BorderDecorator(GLOW_WHITE, 2));
      circle.addToStage();
      circle.render();
      this.shapes.push(circle);
    }

    // Create rectangles
    for (let i = 0; i < 20; i++) {
      const rect = new Rectangle(stage, 40 + Math.random() * 60, 30 + Math.random() * 40);
      rect
        .setPosition(Math.random() * w, Math.random() * h)
        .setFill(PALETTE[(i + 2) % PALETTE.length]);
      rect.vx = (Math.random() - 0.25) * 3;
      rect.vy = (Math.random() - 0.25) * 3;
      if (i === 0) rect.addDecorator(new GlowDecorator(GLOW_TEAL, 4));
      if (i === 1) rect.addDecorator(new OpacityDecorator(0.6));
      rect.addToStage();
      rect.render();
      this.shapes.push(rect);
    }

    // Animation loop
    this.addTicker(() => {
      // Move shapes
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
            a.x += a.vx;
            a.y += a.vy;
            b.x += b.vx;
            b.y += b.vy;
            a.addDecorator(new GlowDecorator(GLOW_WHITE, 5, 400));
            b.addDecorator(new GlowDecorator(GLOW_WHITE, 5, 400));
          }
        }
      }

      // Proximity lines — connect nearby shapes, remove when apart
      this.updateProximityLines(stage);

      // Remove expired glow decorators
      for (const shape of this.shapes) {
        shape.decorators = shape.decorators.filter(
          d => !(d instanceof GlowDecorator && d.expired)
        );
      }

      // Render everything
      for (const shape of this.shapes) shape.render();
      for (const line of this.lines) line.render();
    });

    // On every "beat", randomly swap a fill color on one shape
    this.onTiming('beat', () => {
      const idx = Math.floor(Math.random() * this.shapes.length);
      const shape = this.shapes[idx];
      const newColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      shape.removeDecoratorByType(FillDecorator);
      shape.addDecorator(new FillDecorator(newColor));
    });
  }

  private updateProximityLines(stage: Container): void {
    // Remove lines whose shapes moved apart
    for (let i = this.lines.length - 1; i >= 0; i--) {
      const line = this.lines[i];
      if (line.from && line.to && line.from.distanceTo(line.to) > PROXIMITY) {
        line.destroy();
        this.lines.splice(i, 1);
      }
    }

    // Add lines between newly close shapes
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = i + 1; j < this.shapes.length; j++) {
        const a = this.shapes[i];
        const b = this.shapes[j];
        if (a.distanceTo(b) >= PROXIMITY) continue;

        // Skip if already connected
        const exists = this.lines.some(
          l => (l.from === a && l.to === b) || (l.from === b && l.to === a)
        );
        if (exists) continue;

        const line = new Line(stage, 1.5);
        line.between(a, b).setFill(GLOW_WHITE).setOpacity(0.3);
        line.addDecorator(new GlowDecorator(GLOW_PURPLE, 2, 600));
        line.addToStage();
        this.lines.push(line);
      }
    }
  }

  protected onDestroy(): void {
    for (const shape of this.shapes) shape.destroy();
    for (const line of this.lines) line.destroy();
    this.shapes = [];
    this.lines = [];
  }
}
