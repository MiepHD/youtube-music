import { t } from '@/i18n';
import { createPlugin } from '@/utils';

export default createPlugin({
  name: () => t('plugins.floating-mini-player.name'),
  description: () => t('plugins.floating-mini-player.description'),
  restartNeeded: false,
  config: {
    enabled: true,
    x: '',
    y: '',
  },
  renderer: {
    observer: null as MutationObserver | null,
    top: null as string | null | undefined,
    left: null as string | null | undefined,
    player: null as HTMLElement | null,
    config: null as any,
    start({ getConfig, setConfig }) {
      this.config = setConfig;
      this.top = getConfig().y;
      this.left = getConfig().x;
      this.player = document.getElementById('player');
      this.waitForElem('ytmusic-player-bar').then((bar) => {
        this.observer = new MutationObserver(() => {
          if (bar.getAttribute('player-page-open') == '') {
            this.player?.style.removeProperty('position');
            this.top = this.player?.style.getPropertyValue('top');
            this.player?.style.removeProperty('top');
            this.player?.removeEventListener(
              'mousedown',
              this.mouseDown,
              false,
            );
            window.removeEventListener('mouseup', this.mouseUp, false);
          } else {
            this.player?.style.setProperty('position', 'absolute');
            if (this.top) this.player?.style.setProperty('top', this.top);
            this.player?.addEventListener('mousedown', this.mouseDown, false);
            window.addEventListener('mouseup', this.mouseUp, false);
          }
        });
        this.observer.observe(bar, {
          attributes: true,
          childList: false,
          subtree: false,
        });
      });
    },
    mouseUp() {
      window.removeEventListener('mousemove', this.divMove, true);
    },
    mouseDown() {
      window.addEventListener('mousemove', this.divMove, true);
    },
    divMove(e: MouseEvent) {
      this.player?.style.setProperty(
        'top',
        'calc(-150% + ' + e.clientY + 'px)',
      );
      this.player?.style.setProperty(
        'left',
        'calc(' + e.clientX + 'px' + ' - var(--ytmusic-mini-player-height))',
      );
      this.config({
        x: 'calc(' + e.clientX + 'px' + ' - var(--ytmusic-mini-player-height))',
        y: 'calc(-150% + ' + e.clientY + 'px)',
      });
    },
    stop() {
      this.observer?.disconnect();
      this.player?.style.removeProperty('position');
      this.player?.style.removeProperty('top');
      this.player?.style.removeProperty('left');
    },
    waitForElem(selector: string) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const elem = document.querySelector(selector);
          if (!elem) return;

          clearInterval(interval);
          resolve(elem);
        });
      });
    },
  },
});
