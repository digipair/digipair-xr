import {
  customElement,
  DXRElement,
  html,
  inject,
  nothing,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import '@digipair-xr/design-system';
import { ScreenSharedProvider } from '../providers/screen-shared.provider';
import './desktop';
import './webcam';

declare const NAF: any;

@customElement('dxr-screen-shared', {
  providers: [ScreenSharedProvider],
})
export class ShareScreenElement extends DXRElement {
  @property({ default: '#000000' })
  color!: string;

  @property({ default: false })
  curved!: boolean;

  @inject()
  screenSharedProvider!: ScreenSharedProvider;

  private elementid!: string;

  override init(): void {
    this.elementid = this.screenSharedProvider.elementid;
  }

  private toggleMenu(): void {
    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`,
    );
    const isMine = screenEl && NAF.utils.isMine(screenEl.parentElement);

    if (screenEl && !isMine) {
      return;
    }

    this.screenSharedProvider.toggleMenu();
  }

  private openDesktop(options: { curved?: boolean } = {}): void {
    this.screenSharedProvider.openDesktop(options);
  }

  private openWebcam(options: { curved?: boolean } = {}): void {
    this.screenSharedProvider.openWebcam(options);
  }

  private stop(): void {
    this.screenSharedProvider.stop();
  }

  override render(): TemplateResult {
    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`,
    );
    const isMine = screenEl && NAF.utils.isMine(screenEl.parentElement);

    return html`
      ${screenEl
        ? nothing
        : html`
            <a-entity
              material=${this.curved
                ? `side: back; color: ${this.color};`
                : `side: front; color: ${this.color};`}
              geometry=${this.curved
                ? `primitive: cylinder; openEnded: true; thetaLength: 46; thetaStart: 157; radius: 2; height: 0.9;`
                : `primitive: plane; width: 1.6; height: 0.9;`}
              position=${this.curved ? `0 0 2` : `0 0 0`}
            ></a-entity>
          `}
      ${!this.screenSharedProvider.menuVisible || screenEl
        ? nothing
        : html`
            <dxr-button
              content="Ecran"
              position=${this.curved
                ? `-0.160 0.043 0.01`
                : `-0.160 0.043 0.005`}
              @click=${() => this.openDesktop({ curved: this.curved })}
            ></dxr-button>
            <dxr-button
              content="Webcam"
              position=${this.curved
                ? `-0.160 -0.059 0.010`
                : `-0.160 -0.059 0.005`}
              @click=${() => this.openWebcam({ curved: this.curved })}
            ></dxr-button>
          `}
      ${!this.screenSharedProvider.menuVisible || !isMine
        ? nothing
        : html`
            <dxr-button
              content="Stop"
              position=${this.curved
                ? `-0.160 -0.051 0.010`
                : `-0.160 -0.051 0.005`}
              @click=${() => this.stop()}
            ></dxr-button>
          `}
      <a-entity
        visible="false"
        material=${this.curved ? `side: back;` : `side: front;`}
        geometry=${this.curved
          ? `primitive: cylinder; openEnded: true; thetaLength: 46; thetaStart: 157; radius: 2; height: 0.9;`
          : `primitive: plane; width: 1.6; height: 0.9;`}
        position=${this.curved ? `0 0 2.003` : `0 0 0.003`}
        selectable
        @click=${() => this.toggleMenu()}
      ></a-entity>
    `;
  }
}
