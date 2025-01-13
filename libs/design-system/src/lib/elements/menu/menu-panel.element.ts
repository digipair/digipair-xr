import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';

@customElement('dxr-menu-panel')
export class MenuPanelElement extends DXRElement {
  @property()
  icon!: string;

  @property()
  title!: string;

  override render(): TemplateResult {
    return html`
      <dxr-icon
        position="0.025 0.525 0.001"
        width="1.5"
        icon=${this.icon}
      ></dxr-icon>
      <a-text
        value=${this.title}
        position="0.075 0.525 0.001"
        width="0.6"
        color="#202020"
      ></a-text>
    `;
  }
}
