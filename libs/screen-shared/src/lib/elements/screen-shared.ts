import {
  customElement,
  html,
  inject,
  MetaElement,
  nothing,
  property,
  TemplateResult,
} from '@pinser-metaverse/core';
import '@pinser-metaverse/design-system';
import { ScreenSharedProvider } from '../providers/screen-shared.provider';
import './desktop';
import './webcam';

@customElement('meta-screen-shared', {
  providers: [ScreenSharedProvider],
})
export class ShareScreenElement extends MetaElement {
  @property({ default: '#000000' })
  color!: string;

  @inject()
  screenSharedProvider!: ScreenSharedProvider;

  private elementid!: string;

  override init(): void {
    this.elementid = this.screenSharedProvider.elementid;
  }

  private toggleMenu(): void {
    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`
    );
    const isMine = screenEl && NAF.utils.isMine(screenEl.parentElement);

    if (screenEl && !isMine) {
      return;
    }

    this.screenSharedProvider.toggleMenu();
  }

  private openDesktop(): void {
    this.screenSharedProvider.openDesktop();
  }

  private openWebcam(): void {
    this.screenSharedProvider.openWebcam();
  }

  private stop(): void {
    this.screenSharedProvider.stop();
  }

  override render(): TemplateResult {
    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`
    );
    const isMine = screenEl && NAF.utils.isMine(screenEl.parentElement);

    return html`
      ${screenEl
        ? nothing
        : html`
            <a-plane
              color=${this.color}
              width="1.6"
              height="0.9"
              material="side: front;"
            ></a-plane>
          `}
      ${!this.screenSharedProvider.menuVisible || screenEl
        ? nothing
        : html`
            <meta-button
              content="Ecran"
              position="-0.160 0.043 0.002"
              @click=${() => this.openDesktop()}
            ></meta-button>
            <meta-button
              content="Webcam"
              position="-0.160 -0.059 0.002"
              @click=${() => this.openWebcam()}
            ></meta-button>
          `}
      ${!this.screenSharedProvider.menuVisible || !isMine
        ? nothing
        : html`
            <meta-button
              content="Stop"
              position="-0.160 -0.051 0.002"
              @click=${() => this.stop()}
            ></meta-button>
          `}
      <a-plane
        visible="false"
        width="1.6"
        height="0.9"
        position="0 0 0.003"
        selectable
        @click=${() => this.toggleMenu()}
      >
      </a-plane>
    `;
  }
}