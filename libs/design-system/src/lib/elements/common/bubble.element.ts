import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import './icon.element';

@customElement('dxr-bubble')
export class BubbleElement extends DXRElement {
  @property({ default: '#0062ff' })
  color!: string;

  @property({ default: 'info' })
  icon!: string;

  override render(): TemplateResult {
    return html`
      <a-circle color="#ffffff" radius="0.1">
        <dxr-icon
          position="-0.099 0 0.001"
          color=${this.color}
          icon=${this.icon}
          width="8"
        ></dxr-icon>
      </a-circle>
    `;
  }
}
