import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';
import '../common/icon.element';

@customElement('dxr-menu-button')
export class MenuButtonButtonElement extends DXRElement {
  @property()
  icon!: string;

  override render(): TemplateResult {
    return html`
      <a-circle
        position="0 0 0.001"
        radius="0.015"
        color="#d0d0d0"
        animation__mouseenter="property: position; to: 0 0 0.006; startEvents: mouseenter; dur: 500; easing: easeOutElastic"
        animation__mouseleave="property: position; to: 0 0 0.001; startEvents: mouseleave; dur: 500; easing: easeOutElastic"
        animation__mouseclick="property: position; to: 0 0 0.001; startEvents: click; dur: 500; easing: easeOutElastic"
        selectable
      >
        <dxr-icon color="#202020" position="-0.013 0 0" icon=${this.icon}>
        </dxr-icon>
      </a-circle>
    `;
  }
}
