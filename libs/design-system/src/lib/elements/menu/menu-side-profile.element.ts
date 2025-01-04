import {
  customElement,
  DXRElement,
  html,
  TemplateResult,
} from '@digipair-xr/core';

@customElement('dxr-menu-side-profile')
export class MenuSideElement extends DXRElement {
  private get me(): { username: string; preview: string } {
    return JSON.parse(
      decodeURIComponent(
        atob(
          (this.el.sceneEl?.querySelector('dxr-player [dxr-avatar]') as any)
            .components['dxr-avatar'].data.playerinfo,
        ),
      ),
    );
  }

  override render(): TemplateResult {
    return html`
      ${this.me.preview
        ? html`
            <a-circle
              position="0.12 0.5 0.001"
              radius="0.03"
              src=${this.me.preview}
            >
            </a-circle>
          `
        : html`
            <dxr-icon
              position="0.09 0.5 0.001"
              icon="account_circle"
              width="2.5"
              color="#202020"
            ></dxr-icon>
          `}

      <a-text
        value=${this.me.username || 'Visitor'}
        position="0.12 0.452 0.001"
        width="0.33"
        align="center"
        color="#202020"
      ></a-text>
    `;
  }
}
