import {
    customElement,
    html,
    DXRElement,
    TemplateResult
} from '@digipair-xr/core';

@customElement('dxr-<%= name %>')
export class <%= className %>Element extends DXRElement {
  override render(): TemplateResult {
    return html`<a-box></a-box>`;
  }
}
