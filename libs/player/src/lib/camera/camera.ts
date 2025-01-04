import {
  customElement,
  DXRElement,
  html,
  nothing,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import '../toolbar/toolbar';

@customElement('dxr-player-camera')
export class PlayerCameraElement extends DXRElement {
  @property()
  vrmode!: boolean;

  override render(): TemplateResult {
    return html`
      <a-entity
        static-body="shape: sphere; sphereRadius: 0.02"
        collision-filter="group: player;"
      ></a-entity>

      ${this.vrmode
        ? nothing
        : html`
            <dxr-player-toolbar
              position="0 -0.175 -0.5"
              scale="0.5 0.5 0.5"
            ></dxr-player-toolbar>
          `}
    `;
  }
}
