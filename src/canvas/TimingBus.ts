type TimingCallback = (elapsed: number) => void;

interface TimingEvent {
  name: string;
  intervalMs: number;
  lastFired: number;
  callbacks: Set<TimingCallback>;
}

/**
 * Central timing event bus. Register named intervals (e.g. "beat" every 500ms)
 * and subscribe from scenes. Driven by requestAnimationFrame.
 */
class TimingBus {
  private events = new Map<string, TimingEvent>();
  private running = false;
  private rafId = 0;
  private startTime = 0;

  /** Register a named timing event with an interval in ms. */
  register(name: string, intervalMs: number): void {
    if (!this.events.has(name)) {
      this.events.set(name, {
        name,
        intervalMs,
        lastFired: 0,
        callbacks: new Set(),
      });
    }
  }

  /** Subscribe to a named timing event. Returns an unsubscribe function. */
  on(name: string, callback: TimingCallback): () => void {
    const event = this.events.get(name);
    if (!event) {
      throw new Error(`TimingBus: unknown event "${name}". Register it first.`);
    }
    event.callbacks.add(callback);
    return () => {
      event.callbacks.delete(callback);
    };
  }

  /** Start the timing loop. */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now();
    for (const event of this.events.values()) {
      event.lastFired = this.startTime;
    }
    this.tick();
  }

  /** Stop the timing loop. */
  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  /** Remove all events and callbacks. */
  clear(): void {
    this.stop();
    this.events.clear();
  }

  private tick = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const elapsed = now - this.startTime;

    for (const event of this.events.values()) {
      if (now - event.lastFired >= event.intervalMs) {
        event.lastFired = now;
        for (const cb of event.callbacks) {
          cb(elapsed);
        }
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}

export const timingBus = new TimingBus();

// Default timing events
timingBus.register('tick', 16);       // ~60fps
timingBus.register('beat', 500);      // 2x per second
timingBus.register('measure', 2000);  // every 2 seconds
timingBus.register('phrase', 8000);   // every 8 seconds
