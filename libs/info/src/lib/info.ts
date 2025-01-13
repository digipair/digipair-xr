import {
  customElement,
  DXRElement,
  Entity,
  html,
  nothing,
  property,
  state,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';
import '@digipair-xr/design-system';

@customElement('dxr-info')
export class InfoElement extends DXRElement {
  @property({ default: '#0062ff' })
  color!: string;

  @property({ default: 2 })
  width!: number;

  @property({ default: 1 })
  height!: number;

  @property({ default: 'info' })
  icon!: string;

  @state()
  displayed = false;

  private content(): TemplateResult {
    const template = this.el.querySelector(
      ':scope > template[slot="content"]',
    )?.innerHTML;
    return html`${template ? unsafeHTML(template) : nothing}`;
  }

  private toggleMenu({ els }: { els: Entity[]; clearedEls: Entity[] }) {
    if (els.length > 0) {
      this.displayed = true;
    } else {
      this.displayed = false;
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.displayed
        ? nothing
        : html`
            <dxr-bubble
              color=${this.color}
              icon="info"
              position=${`0 ${this.height / 2} 0`}
            ></dxr-bubble>
          `}
      ${!this.displayed
        ? nothing
        : html`
            <dxr-dialog
              position=${`-${this.width / 2} 0 0`}
              width=${this.width}
              height=${this.height}
              color=${this.color}
              icon=${this.icon}
            >
              ${this.content()}
            </dxr-dialog>
          `}

      <a-box
        width="1.5"
        height="2"
        depth="5"
        position="0 0 2.5"
        static-body
        collision-filter="collidesWith: player, hand;"
        physics-collider
        visible="false"
        @collisions=${({ detail }: any) => this.toggleMenu(detail)}
      ></a-box>
    `;
  }
}
