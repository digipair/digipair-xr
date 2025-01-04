import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import { icons } from '../../const/icons.const';

@customElement('dxr-icon')
export class UiIconElement extends DXRElement {
  @property()
  icon!: string;

  @property({ default: '#000000' })
  color!: string;

  @property({ default: 1 })
  width!: string;

  override render(): TemplateResult {
    return html`
      <a-text
        value=${icons[this.icon]}
        font="https://assets.pinser-metaverse.com/fonts/icons/icons.fnt"
        color=${this.color}
        width=${this.width}
        negate="false"
      >
      </a-text>
    `;
  }
}
