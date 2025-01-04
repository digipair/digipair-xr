import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import './bubble.element';

@customElement('dxr-dialog')
export class DialogElement extends DXRElement {
  @property({ default: '#0062ff' })
  color!: string;

  @property({ default: 'info' })
  icon!: string;

  @property({ default: 2 })
  width!: number;

  @property({ default: 1 })
  height!: number;

  override render(): TemplateResult {
    return html`
      <a-rounded
        radius="0.045"
        width=${this.width}
        height=${this.height}
        color="#ffffff"
      >
        <a-rounded
          position="0 ${this.height - 0.045} 0.001"
          radius="0"
          bottom-left-radius="-0.001"
          bottom-right-radius="-0.001"
          top-left-radius="0.045"
          top-right-radius="0.045"
          width=${this.width}
          height="0.045"
          color=${this.color}
        >
        </a-rounded>

        <dxr-bubble
          color=${this.color}
          icon=${this.icon}
          position="${this.width / 2} ${this.height} 0.002"
        ></dxr-bubble>
      </a-rounded>
    `;
  }
}
