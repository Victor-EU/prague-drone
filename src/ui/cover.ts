// The cover (design.md §10.2): the drone's first view under three lines of small capitals, from the
// dark ground of loading to the lift into the flight. Plain DOM; the timing is in hud.css.

export class Cover {
  private el: HTMLElement;
  private go: HTMLElement;
  private state: 'loading' | 'shown' | 'ready' | 'lifted' = 'loading';
  private onFly: () => void;

  constructor(parent: HTMLElement, onFly: () => void) {
    this.onFly = onFly;
    this.el = document.createElement('div');
    this.el.id = 'cover';
    this.el.innerHTML = `
      <div class="ground"></div>
      <div class="veil"></div>
      <div class="words"><h1>PRAHA</h1><div class="sub">EARLY SUMMER · FROM THE AIR</div><div class="go">LOADING THE CITY</div></div>`;
    parent.appendChild(this.el);
    this.go = this.el.querySelector('.go')!;
    this.el.addEventListener('click', () => this.lift());
  }

  /** True until the cover has lifted. */
  get up() {
    return this.state !== 'lifted';
  }

  /** The first frame is drawn: the city fades in beneath the words. */
  showCity() {
    if (this.state !== 'loading') return;
    this.state = 'shown';
    this.el.classList.add('shown');
  }

  /** The tiles are in: the call to fly. */
  ready() {
    if (this.state !== 'shown') return;
    this.state = 'ready';
    this.go.textContent = 'CLICK TO FLY';
    this.el.classList.add('ready');
  }

  /** A click or a key: the words and the darkening fade, the flight starts. */
  lift() {
    if (this.state === 'lifted') return;
    this.state = 'lifted';
    this.el.classList.add('lifted');
    this.onFly();
    setTimeout(() => this.el.remove(), 1800);
  }
}
