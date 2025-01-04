import {
  customElement,
  DXRElement,
  html,
  TemplateResult,
} from '@digipair-xr/core';
import './logo-box';

@customElement('dxr-logo')
export class LogoElement extends DXRElement {
  public override render(): TemplateResult {
    return html`
      <dxr-logo-box position="-0.5 -0.5 -0.5">
        <dxr-logo-box
          scale="0.5 0.5 0.5"
          position="0.25 0.25 0.25"
          opacity="1"
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
        ></dxr-logo-box>
      </dxr-logo-box>
    `;
  }
}
