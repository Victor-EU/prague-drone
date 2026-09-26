// The heads-up display (design.md §10.1). Plain DOM; updated a few times a second.

import './hud.css';
import { formatClock } from '../core/sun.ts';

export interface HudState {
  mode: 'auto' | 'fast' | 'manual';
  clock: number;
  sun: number;
  altitude: number;
  dayAdvances: boolean;
  /** Cloud coverage now, 0 to 1. */
  clouds: number;
  overcast: boolean;
}

export interface HudActions {
  setClock(hours: number): void;
  setDayAdvances(on: boolean): void;
  setMode(mode: 'auto' | 'fast' | 'manual'): void;
  setOvercast(on: boolean): void;
}

const MIN_CLOCK = 4.5, MAX_CLOCK = 23;

export class Hud {
  private el: HTMLElement;
  private chip!: HTMLElement;
  private clock!: HTMLElement;
  private sun!: HTMLElement;
  private alt!: HTMLElement;
  private clouds!: HTMLElement;
  private weather!: HTMLButtonElement;
  private slider!: HTMLInputElement;
  private check!: HTMLInputElement;
  private buttons!: Record<string, HTMLButtonElement>;
  private landmark!: HTMLElement;
  private keys!: HTMLElement;
  readonly stats: HTMLElement;
  private dragging = false;
  private shownLandmark = '';

  constructor(root: HTMLElement, actions: HudActions, attribution: string) {
    this.el = root;
    root.innerHTML = `
      <div class="tl">
        <h1>PRAHA</h1>
        <div class="sub">EARLY SUMMER · STARÉ MĚSTO · MALÁ STRANA · PETŘÍN · VYŠEHRAD</div>
        <div class="chip" data-chip></div>
      </div>
      <div class="tr">
        <div class="clock" data-clock>06:20</div>
        <div>SUN <span data-sun>0°</span> · CLOUDS <span data-clouds>—</span></div>
        <div>ALT <span data-alt>0 m</span></div>
      </div>
      <div id="landmark"><div class="cz"></div><div class="en"></div></div>
      <div id="stats"></div>
      <div class="bottom">
        <div class="keys" data-keys>
          <div><kbd>←</kbd><kbd>→</kbd> turn &nbsp; <kbd>↑</kbd><kbd>↓</kbd> altitude</div>
          <div><kbd>⇧</kbd> faster &nbsp; <kbd>␣</kbd> hover &nbsp; <kbd>W</kbd><kbd>S</kbd> tilt</div>
          <div><kbd>A</kbd><kbd>D</kbd> strafe &nbsp; <kbd>⏎</kbd> back to auto &nbsp; <kbd>C</kbd> new clouds</div>
        </div>
        <div class="panel interactive">
          <div class="row">
            <div class="lbl">TIME OF DAY</div>
            <input type="range" data-slider min="${MIN_CLOCK}" max="${MAX_CLOCK}" step="0.01" value="6.33" aria-label="Time of day">
            <label class="check"><input type="checkbox" data-check checked> DAY ADVANCES WITH FLIGHT</label>
          </div>
          <div class="row">
            <div class="lbl">MODE</div>
            <div class="btns">
              <button data-mode="auto">AUTO 6:00</button>
              <button data-mode="fast">FAST 3:00</button>
              <button data-mode="manual">MANUAL</button>
            </div>
            <div class="lbl right">WEATHER</div>
            <div class="btns"><button data-weather>OVERCAST</button></div>
          </div>
        </div>
      </div>
      <div class="attribution">${attribution}</div>`;
    const q = <T extends HTMLElement>(s: string) => root.querySelector(s) as T;
    this.chip = q('[data-chip]');
    this.clock = q('[data-clock]');
    this.sun = q('[data-sun]');
    this.alt = q('[data-alt]');
    this.clouds = q('[data-clouds]');
    this.weather = q('[data-weather]');
    this.slider = q('[data-slider]');
    this.check = q('[data-check]');
    this.landmark = q('#landmark');
    this.keys = q('[data-keys]');
    this.stats = q('#stats');
    this.buttons = Object.fromEntries([...root.querySelectorAll<HTMLButtonElement>('[data-mode]')].map((b) => [b.dataset.mode!, b]));

    this.slider.addEventListener('input', () => {
      this.dragging = true;
      this.check.checked = false;
      actions.setDayAdvances(false);
      actions.setClock(Number(this.slider.value));
    });
    this.slider.addEventListener('change', () => { this.dragging = false; this.slider.blur(); });
    this.check.addEventListener('change', () => { actions.setDayAdvances(this.check.checked); this.check.blur(); });
    this.weather.addEventListener('click', () => {
      actions.setOvercast(!this.weather.classList.contains('on'));
      this.weather.blur();
    });
    for (const [mode, b] of Object.entries(this.buttons))
      b.addEventListener('click', () => { actions.setMode(mode as HudState['mode']); b.blur(); });

  }

  /** The interface is showing: the key hint stays for 20 s from now (design.md §10.1). */
  shown() {
    setTimeout(() => (this.keys.style.opacity = '0'), 20000);
  }

  update(s: HudState) {
    this.chip.innerHTML = s.mode === 'manual' ? 'MANUAL' : s.mode === 'fast' ? 'FAST · <b>3:00</b>' : 'AUTO · <b>6:00</b>';
    for (const [m, b] of Object.entries(this.buttons)) b.classList.toggle('on', m === s.mode);
    this.clock.textContent = formatClock(s.clock);
    this.sun.textContent = `${Math.round(s.sun)}°`;
    this.alt.textContent = `${Math.round(s.altitude)} m`;
    this.clouds.textContent = `${Math.round(s.clouds * 100)}%`;
    this.weather.classList.toggle('on', s.overcast);
    if (!this.dragging) this.slider.value = String(Math.min(MAX_CLOCK, Math.max(MIN_CLOCK, s.clock)));
    if (this.check.checked !== s.dayAdvances) this.check.checked = s.dayAdvances;
  }

  setLandmark(cz: string, en: string) {
    const key = cz + en;
    if (key === this.shownLandmark) return;
    this.shownLandmark = key;
    if (!cz) {
      this.landmark.style.opacity = '0';
      return;
    }
    this.landmark.querySelector('.cz')!.textContent = cz.toUpperCase();
    this.landmark.querySelector('.en')!.textContent = en.toUpperCase();
    this.landmark.style.opacity = '1';
  }
}
