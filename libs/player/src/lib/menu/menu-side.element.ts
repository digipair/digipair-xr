import {
  customElement,
  DXRElement,
  html,
  inject,
  TemplateResult,
} from '@digipair-xr/core';
import '@digipair-xr/design-system';
import { PlayerProvider } from '../player/player.provider';
import { MenuProvider } from './menu.provider';

@customElement('dxr-player-menu-side')
export class MenuSideElement extends DXRElement {
  @inject()
  private menuProvider!: MenuProvider;

  @inject()
  private playerProvider!: PlayerProvider;

  override render(): TemplateResult {
    return html`
      <dxr-menu-side-profile>
        <dxr-button
          content="Pin's"
          position="0.036 0.36 0"
          scale="0.5 0.5 1"
          @click=${() => (this.menuProvider.panel = 'pins')}
        ></dxr-button>
        <dxr-button
          content="Scene"
          position="0.036 0.30 0"
          scale="0.5 0.5 1"
          @click=${() => (this.menuProvider.panel = 'scene')}
        ></dxr-button>

        <a-entity position="0.075 0.03 0">
          <dxr-menu-button
            position="0.029 0 0"
            icon=${this.playerProvider.playersound ? 'volume_up' : 'volume_off'}
            @click=${() =>
              this.playerProvider.setSound(!this.playerProvider.playersound)}
          ></dxr-menu-button>
          <dxr-menu-button
            position="0.062 0 0"
            icon=${this.playerProvider.playermic ? 'mic' : 'mic_off'}
            @click=${() =>
              this.playerProvider.setMic(!this.playerProvider.playermic)}
          ></dxr-menu-button>
        </a-entity>
      </dxr-menu-side-profile>
    `;
  }
}
