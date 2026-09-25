// Keyboard state for the drone (design.md §9.1).

export class Keys {
  private down = new Set<string>();
  private pressed: string[] = [];

  constructor(target: Window) {
    target.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.code;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(k)) e.preventDefault();
      if (!e.repeat) this.pressed.push(k);
      this.down.add(k);
    });
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    target.addEventListener('blur', () => this.down.clear());
  }

  held(code: string): boolean {
    return this.down.has(code);
  }

  /** Key presses since the last call, in order. */
  drain(): string[] {
    const p = this.pressed;
    this.pressed = [];
    return p;
  }
}
