import {
  customElement,
  DXRElement,
  html,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';
import '@digipair-xr/design-system';
import './menu-panels.element';
import './menu-side.element';
import { MenuProvider } from './menu.provider';

@customElement('dxr-player-menu', {
  providers: [MenuProvider],
})
export class MenuElement extends DXRElement {
  private defaultMenu(): TemplateResult {
    return html`
      <dxr-menu>
        <template slot="menu">
          <dxr-player-menu-side></dxr-menu-side>
        </template>

        <template slot="panel">
          <dxr-player-menu-panels></dxr-menu-panels>
        </template>
      </dxr-menu>
    `;
  }

  override render(): TemplateResult {
    const template = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=menu]')?.innerHTML;

    if (!template) {
      return this.defaultMenu();
    }

    return html`${unsafeHTML(template)}`;
  }
}
