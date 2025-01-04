import {
  customElement,
  DXRElement,
  html,
  inject,
  nothing,
  property,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';
import { PlayerProvider } from '@digipair-xr/player';

@customElement('dxr-scene-container', {
  providers: [PlayerProvider],
})
export class SceneContainerElement extends DXRElement {
  @property()
  session!: string;

  @property()
  server!: string;

  @property()
  adapter!: string;

  @property()
  development!: boolean;

  @inject()
  playerProvider!: PlayerProvider;

  override init(): void {
    if (this.session) {
      this.startSession();
    }
  }

  private startSession() {
    this.playerProvider.debug = this.development;
    this.playerProvider.networked = {
      serverURL: this.server,
      adapter: this.adapter,
    };

    this.playerProvider.startSession(this.session);
  }

  private scene(): TemplateResult {
    const scene = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=scene]');

    return html`${!scene ? nothing : unsafeHTML(scene.innerHTML)}`;
  }

  override render(): TemplateResult {
    this.playerProvider.debug = this.development;
    this.playerProvider.networked = {
      serverURL: this.server,
      adapter: this.adapter,
    };

    return html`
      <dxr-player></dxr-player>

      ${this.scene()}
    `;
  }
}
