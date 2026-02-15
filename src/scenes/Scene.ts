import type { CanvasManager } from '../canvas/CanvasManager';
import { timingBus } from '../canvas/TimingBus';

export abstract class Scene {
  protected manager!: CanvasManager;
  private tickerCallbacks: Array<(dt: { deltaTime: number }) => void> = [];
  private timingUnsubscribes: Array<() => void> = [];

  setup(manager: CanvasManager): void {
    this.manager = manager;
    this.manager.clearStage();
    timingBus.start();
    this.onSetup();
  }

  protected addTicker(callback: (dt: { deltaTime: number }) => void): void {
    this.tickerCallbacks.push(callback);
    this.manager.ticker.add(callback);
  }

  /** Subscribe to a TimingBus event. Automatically cleaned up on destroy. */
  protected onTiming(name: string, callback: (elapsed: number) => void): void {
    const unsub = timingBus.on(name, callback);
    this.timingUnsubscribes.push(unsub);
  }

  destroy(): void {
    for (const cb of this.tickerCallbacks) {
      this.manager.ticker.remove(cb);
    }
    this.tickerCallbacks = [];

    for (const unsub of this.timingUnsubscribes) {
      unsub();
    }
    this.timingUnsubscribes = [];

    timingBus.stop();
    this.manager.clearStage();
    this.onDestroy();
  }

  protected abstract onSetup(): void;

  protected onDestroy(): void {
    // Override if needed
  }
}
