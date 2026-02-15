import { Application, type Container, type Ticker } from 'pixi.js';

export class CanvasManager {
  app: Application;
  private initialized = false;

  constructor() {
    this.app = new Application();
  }

  async init(container: HTMLElement): Promise<void> {
    if (this.initialized) {
      container.appendChild(this.app.canvas as HTMLCanvasElement);
      return;
    }

    await this.app.init({
      resizeTo: window,
      background: '#1a1a2e',
      antialias: true,
    });

    container.appendChild(this.app.canvas as HTMLCanvasElement);
    this.initialized = true;
  }

  get stage(): Container {
    return this.app.stage;
  }

  get ticker(): Ticker {
    return this.app.ticker;
  }

  clearStage(): void {
    this.app.stage.removeChildren();
  }

  destroy(): void {
    if (!this.initialized) return;
    this.app.destroy(true);
    this.initialized = false;
  }
}

// Singleton instance
export const canvasManager = new CanvasManager();
