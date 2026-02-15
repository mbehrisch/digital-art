import { Application, type Container, type Ticker } from 'pixi.js';
import { BACKGROUND } from '../theme/colors';

export class CanvasManager {
  app: Application;
  initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.app = new Application();
  }

  async init(container: HTMLElement): Promise<void> {
    if (this.initialized) {
      container.appendChild(this.app.canvas as HTMLCanvasElement);
      return;
    }

    // Deduplicate concurrent init calls (StrictMode double-invoke)
    if (!this.initPromise) {
      this.initPromise = this.app.init({
        resizeTo: window,
        background: BACKGROUND,
        antialias: true,
      });
    }

    await this.initPromise;
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
    this.initPromise = null;
  }
}

// Singleton instance — preserved across Vite HMR to avoid re-init
export const canvasManager: CanvasManager =
  (import.meta.hot?.data?.canvasManager as CanvasManager) ?? new CanvasManager();

if (import.meta.hot) {
  import.meta.hot.data.canvasManager = canvasManager;
}
