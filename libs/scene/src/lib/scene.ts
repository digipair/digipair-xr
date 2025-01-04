import {
  customHtmlElement,
  DXRHtmlElement,
  html,
  propertyHtml,
  TemplateResult,
} from '@digipair-xr/core';
import 'aframe-extras';
import 'aframe-gradient-sky';
import 'aframe-physics-extras';
import 'aframe-physics-system/dist/aframe-physics-system.js';
import 'aframe-rounded';
import 'networked-aframe';
import './scene-container';

@customHtmlElement('dxr-scene')
export class SceneElement extends DXRHtmlElement {
  @propertyHtml()
  private session!: string;

  @propertyHtml()
  private server = 'https://networked.digipair.ai';

  @propertyHtml()
  private draco = 'https://assets.pinser-metaverse.com/draco/';

  @propertyHtml()
  private adapter = 'easyrtc';

  @propertyHtml({ type: Boolean })
  private development = false;

  @propertyHtml({ type: Boolean })
  private debugphysics = false;

  override render(): TemplateResult {
    return html`
      <a-scene
        keyboard-shortcuts="enterVR: false"
        physics=${`debug: ${this.debugphysics}; driver: local;`}
        ?debug=${this.development}
        ?stats=${this.development}
        ar-hit-test="footprintDepth: 1;"
        gltf-model=${`dracoDecoderPath: ${this.draco};`}
      >
        <dxr-scene-container
          session=${this.session}
          server=${this.server}
          adapter=${this.adapter}
          development=${this.development}
        ></dxr-scene-container>
      </a-scene>
    `;
  }
}
