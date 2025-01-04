import {
  customElement,
  DXRElement,
  html,
  inject,
  TemplateResult,
} from '@digipair-xr/core';
import { PlayerProvider } from '../player/player.provider';

@customElement('dxr-player-toolbar-default')
export class PlayerToolbarDefaultElement extends DXRElement {
  @inject()
  playerProvider!: PlayerProvider;

  private toggleMenu(): void {
    this.playerProvider.toggleMenu();
  }

  private stopCursor(): void {
    this.playerProvider.stopCursor();
  }

  override render(): TemplateResult {
    return this.playerProvider.customcursor
      ? html`
          <a-box
            opacity="0"
            width="0.02"
            height="0.02"
            depth="0.002"
            position="0 0.02 0"
            selectable
            animation__mouseenter="property: scale; to: 1.4 1.4 1.4; startEvents: mouseenter; dur: 500; easing: easeOutElastic"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 500; easing: easeOutElastic"
            animation__mouseclick="property: scale; to: 1 1 1; startEvents: click; dur: 500; easing: easeOutElastic"
            @click=${() => this.stopCursor()}
          >
            <a-box
              color="#202020"
              width="0.02"
              height="0.002"
              depth="0.002"
              rotation="0 0 45"
            ></a-box>
            <a-box
              color="#202020"
              width="0.02"
              height="0.002"
              depth="0.002"
              rotation="0 0 -45"
            ></a-box>
          </a-box>
        `
      : html`
          <a-box
            opacity="0"
            position="0 0.02 0"
            rotation="0 -45 0"
            scale="0.02 0.02 0.02"
            selectable
            @click=${() => this.toggleMenu()}
            animation__mouseenter="property: scale; to: 0.025 0.025 0.025; startEvents: mouseenter; dur: 500; easing: easeOutElastic"
            animation__mouseleave="property: scale; to: 0.02 0.02 0.02; startEvents: mouseleave; dur: 500; easing: easeOutElastic"
            animation__mouseclick="property: scale; to: 0.02 0.02 0.02; startEvents: click; dur: 500; easing: easeOutElastic"
          >
            <dxr-logo></dxr-logo>
          </a-box>
        `;
  }
}
