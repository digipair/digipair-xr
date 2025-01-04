import {
  customElement,
  DXRElement,
  html,
  inject,
  TemplateResult,
} from '@digipair-xr/core';
import '@digipair-xr/design-system';
import { MenuProvider } from './menu.provider';
import './pins/menu-panel-pins';
import './scene/menu-panel-scene';

@customElement('dxr-player-menu-panels')
export class MenuSideElement extends DXRElement {
  @inject()
  private menuProvider!: MenuProvider;

  override render(): TemplateResult {
    const panels: { [key: string]: TemplateResult } = {
      pins: html`
        <dxr-player-menu-planel-pins
          repository="https://assets.pinser-metaverse.com/pins/list.json"
        ></dxr-player-menu-planel-pins>
      `,
      scene: html`<dxr-player-menu-planel-scene></dxr-player-menu-planel-scene>`,
    };

    return panels[this.menuProvider.panel];
  }
}
