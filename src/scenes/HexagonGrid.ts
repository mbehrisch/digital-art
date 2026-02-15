import { Scene } from './Scene';
import { Hexagon } from '../models/shapes/Hexagon';
import { BorderDecorator } from '../models/decorators/BorderDecorator';
import { GlowDecorator } from '../models/decorators/GlowDecorator';
import { FillDecorator } from '../models/decorators/FillDecorator';
import { PALETTE, GLOW_WHITE, GLOW_TEAL } from '../theme/colors';

interface HexCell {
  hex: Hexagon;
  col: number;
  row: number;
}

export class HexagonGrid extends Scene {
  private cells: HexCell[] = [];
  private time = 0;

  protected onSetup(): void {
    const stage = this.manager.stage;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const radius = 100;
    const hexW = Math.sqrt(3) * radius;   // pointy-top width
    const hexH = 2 * radius;              // pointy-top height
    const rowStep = hexH * 0.75;          // vertical spacing

    const cols = Math.ceil(w / hexW) + 2;
    const rows = Math.ceil(h / rowStep) + 2;

    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === 1 ? hexW / 2 : 0;
      for (let col = 0; col < cols; col++) {
        const x = col * hexW + offset;
        const y = row * rowStep;

        const hex = new Hexagon(stage, radius - 1);
        hex.setPosition(x, y);

        const idx = (col + row) % PALETTE.length;
        hex.setFill(PALETTE[idx]);
        hex.addDecorator(new BorderDecorator(0x111122, 1));

        hex.addToStage();
        hex.render();
        this.cells.push({ hex, col, row });
      }
    }

    // Color wave animation
    this.addTicker((dt) => {
      this.time += dt.deltaTime * 0.02;

      for (const cell of this.cells) {
        const wave = (cell.col * 0.3 + cell.row * 0.2 + this.time) % PALETTE.length;
        const idx = Math.floor(wave);
        const next = (idx + 1) % PALETTE.length;
        const t = wave - idx;

        const color = lerpColor(PALETTE[idx], PALETTE[next], t);
        cell.hex.removeDecoratorByType(FillDecorator);
        cell.hex.baseFillColor = color;
      }

      // Clean up expired glows
      for (const cell of this.cells) {
        cell.hex.decorators = cell.hex.decorators.filter(
          d => !(d instanceof GlowDecorator && d.expired)
        );
        cell.hex.render();
      }
    });

    // Beat: random hex glow
    this.onTiming('beat', () => {
      const cell = this.cells[Math.floor(Math.random() * this.cells.length)];
      cell.hex.addDecorator(new GlowDecorator(GLOW_WHITE, 4, 500));
    });

    // Measure: ripple from a random center
    this.onTiming('measure', () => {
      const center = this.cells[Math.floor(Math.random() * this.cells.length)];
      const cx = center.hex.x;
      const cy = center.hex.y;
      const maxDist = 300;

      for (const cell of this.cells) {
        const dx = cell.hex.x - cx;
        const dy = cell.hex.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) continue;

        const delay = dist * 2;
        setTimeout(() => {
          cell.hex.addDecorator(new GlowDecorator(GLOW_TEAL, 3, 400));
        }, delay);
      }
    });
  }

  protected onDestroy(): void {
    for (const cell of this.cells) cell.hex.destroy();
    this.cells = [];
  }
}

/** Linear interpolation between two 0xRRGGBB colors. */
function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}
