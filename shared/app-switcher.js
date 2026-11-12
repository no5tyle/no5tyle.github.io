/*
  The app switcher every no5tyle app shows at the top left, in place of its own icon:

    <script src="https://no5tyle.github.io/shared/app-switcher.js" defer></script>
    <n5-app-switcher current="beacon">
      <img src="…the app's own icon…" alt="" width="36" height="36">
    </n5-app-switcher>

  The button shows the current app's icon; it opens a menu of every app, with the current one
  marked, and a link to the homepage. Whatever the element holds is shown until this script runs, so
  the app's icon stays put if the script can't load. It draws into the page itself (no shadow DOM),
  styled by the .n5-switch rules in shared/no5tyle.css. Size it with --n5-switch-size (36px).

  To add an app, add it to APPS below: every app's switcher picks it up the next time it's opened.
*/
(() => {
  if (customElements.get('n5-app-switcher')) return;

  const here = document.currentScript?.src || 'https://no5tyle.github.io/shared/app-switcher.js';
  const icon = (file) => new URL(`icons/${file}`, here).href;
  const HOME = new URL('../', here).href;

  const APPS = [
    { id: 'beacon', name: 'Beacon', tagline: 'OAS, progress and insights from Terrain', url: 'https://no5tyle.github.io/Beacon/', icon: icon('beacon.png') },
    { id: 'programmer', name: 'Program Builder', tagline: 'Term programs for Scout families', url: 'https://no5tyle.github.io/programmer/', icon: icon('programmer.svg') },
    { id: 'snagcalc', name: 'Snag Calc', tagline: 'Sausage sizzle shopping and restock', url: 'https://no5tyle.github.io/snagCalc/', icon: icon('snagcalc.svg') },
    { id: 'pinewood', name: 'Pinewood Control', tagline: 'Race night for pinewood derbies', url: 'https://pinewood.nostyle.app/', icon: icon('pinewood.svg') },
  ];

  const CHEVRON =
    '<svg class="n5-switch-chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHECK =
    '<svg class="n5-switch-check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const escape = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let count = 0;

  class AppSwitcher extends HTMLElement {
    connectedCallback() {
      if (this.button) return;
      const current = APPS.find((app) => app.id === this.getAttribute('current'));
      const id = `n5-switch-${++count}`;
      this.classList.add('n5-switch');
      this.innerHTML = `
        <button type="button" class="n5-switch-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}"
          aria-label="${escape(current ? `${current.name}: switch app` : 'Switch app')}" title="Switch app">
          <img class="n5-switch-icon" src="${escape(current?.icon ?? icon('home.svg'))}" alt="" width="36" height="36">
          ${CHEVRON}
        </button>
        <div class="n5-switch-backdrop" hidden></div>
        <div class="n5-switch-menu" id="${id}" role="menu" aria-label="no5tyle apps" hidden>
          <div class="n5-switch-head" aria-hidden="true">no5tyle apps</div>
          ${APPS.map((app) => `
            <a class="n5-switch-item" role="menuitem" href="${escape(app.url)}" ${app === current ? 'aria-current="page"' : ''}>
              <img src="${escape(app.icon)}" alt="" width="36" height="36">
              <span class="n5-switch-text"><span class="n5-switch-name">${escape(app.name)}</span><span class="n5-switch-tagline">${escape(app.tagline)}</span></span>
              ${app === current ? CHECK : ''}
            </a>`).join('')}
          <a class="n5-switch-item n5-switch-all" role="menuitem" href="${escape(HOME)}">
            <img src="${escape(icon('home.svg'))}" alt="" width="36" height="36">
            <span class="n5-switch-text"><span class="n5-switch-name">All apps</span><span class="n5-switch-tagline">no5tyle.github.io</span></span>
          </a>
        </div>`;
      this.button = this.querySelector('.n5-switch-btn');
      this.menu = this.querySelector('.n5-switch-menu');
      this.backdrop = this.querySelector('.n5-switch-backdrop');
      this.items = [...this.querySelectorAll('.n5-switch-item')];
      this.button.addEventListener('click', () => (this.isOpen ? this.close() : this.open()));
      this.backdrop.addEventListener('click', () => this.close());
      this.addEventListener('keydown', (e) => this.onKey(e));
      // Moving to another app (or within this one) closes the menu
      this.items.forEach((item) => item.addEventListener('click', () => this.close(false)));
    }

    get isOpen() {
      return !this.menu.hidden;
    }

    open() {
      this.menu.hidden = this.backdrop.hidden = false;
      this.button.setAttribute('aria-expanded', 'true');
      (this.items.find((item) => item.hasAttribute('aria-current')) ?? this.items[0]).focus();
    }

    close(refocus = true) {
      if (!this.isOpen) return;
      this.menu.hidden = this.backdrop.hidden = true;
      this.button.setAttribute('aria-expanded', 'false');
      if (refocus) this.button.focus();
    }

    onKey(e) {
      if (!this.isOpen) {
        if (e.target === this.button && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          this.open();
        }
        return;
      }
      const at = this.items.indexOf(document.activeElement);
      const move = (to) => {
        e.preventDefault();
        this.items[(to + this.items.length) % this.items.length].focus();
      };
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      } else if (e.key === 'ArrowDown') move(at + 1);
      else if (e.key === 'ArrowUp') move(at < 0 ? -1 : at - 1);
      else if (e.key === 'Home') move(0);
      else if (e.key === 'End') move(-1);
      else if (e.key === 'Tab') this.close(false);
    }
  }

  customElements.define('n5-app-switcher', AppSwitcher);
})();
