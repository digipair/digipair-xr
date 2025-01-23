import {
  customElement,
  DXRElement,
  html,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';
import './toolbar-default';

@customElement('dxr-player-toolbar')
export class PlayerToolbarElement extends DXRElement {
  override render(): TemplateResult {
    const template = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=toolbar]')?.innerHTML;

    return template ? html`${unsafeHTML(template)}` : html``;
  }
}
