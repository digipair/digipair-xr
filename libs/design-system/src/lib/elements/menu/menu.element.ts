import {
  customElement,
  DXRElement,
  html,
  nothing,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';

@customElement('dxr-menu')
export class MenuElement extends DXRElement {
  override render(): TemplateResult {
    const templateMenu = this.el.querySelector(
      ':scope > template[slot=menu]',
    )?.innerHTML;

    const templatePanel = this.el.querySelector(
      ':scope > template[slot=panel]',
    )?.innerHTML;

    return html`
      <a-rounded
        position="0 0 0"
        width="0.240"
        height="0.560"
        radius="0.025"
        color="#c0c0c0"
        selectable
      >
        ${!templateMenu ? nothing : unsafeHTML(templateMenu)}
      </a-rounded>
      <a-rounded
        position="0.26 0 0"
        width="0.800"
        height="0.560"
        color="#c0c0c0"
        radius="0.025"
        selectable
      >
        ${!templatePanel ? nothing : unsafeHTML(templatePanel)}
      </a-rounded>
    `;
  }
}
