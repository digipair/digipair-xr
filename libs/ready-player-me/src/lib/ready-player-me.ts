import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import '@digipair-xr/mesh';

@customElement('dxr-ready-player-me')
export class ReadyPlayerMeElement extends DXRElement {
  @property()
  playerinfo: any;

  override render(): TemplateResult {
    return html`
      <a-entity position="0 -0.65 0.05" rotation="0 180 0">
        <a-rounded
          color="#ffffff"
          width="0.6"
          radius="0.05"
          height="0.1"
          position="-0.3 0.85 -0.02"
        >
          <a-text
            color="#424242"
            value=${this.playerinfo.username}
            position="0.3 0.052 0"
            align="center"
            width="1.8"
          ></a-text>
          <a-text
            color="#424242"
            value=${this.playerinfo.username}
            position="0.3 0.052 0"
            rotation="0 180 0"
            align="center"
            width="1.8"
          ></a-text>
        </a-rounded>

        <a-gltf-model src=${this.playerinfo.avatar} position="0 0 -0.04">
          <dxr-mesh object="LeftHand" scale="0 0 0"></dxr-mesh>
          <dxr-mesh object="RightHand" scale="0 0 0"></dxr-mesh>
        </a-gltf-model>
      </a-entity>
    `;
  }
}
