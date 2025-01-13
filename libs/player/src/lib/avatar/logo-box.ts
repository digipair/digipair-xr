import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
} from '@digipair-xr/core';

@customElement('dxr-logo-box')
export class BoxElement extends DXRElement {
  @property({ default: '#fe78a9' })
  color1!: string;

  @property({ default: '#f3910d' })
  color2!: string;

  @property({ default: '#5fa6dc' })
  color3!: string;

  @property({ default: 0.9 })
  opacity!: number;

  public override render(): TemplateResult {
    return html`
      <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color1}
            top-left-radius="0"
            bottom-left-radius="0.2"
            top-right-radius="0.2"
            bottom-right-radius="0"
            opacity=${this.opacity}
            rotation="0 0 0"
            position="0 0 1"
          ></a-rounded>
          <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color2}
            top-left-radius="0"
            bottom-left-radius="0.2"
            top-right-radius="0.2"
            bottom-right-radius="0"
            opacity=${this.opacity}
            rotation="0 -90 0"
            position="1 0 0"
          ></a-rounded>
          <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color3}
            top-left-radius="0"
            bottom-left-radius="0.2"
            top-right-radius="0.2"
            bottom-right-radius="0"
            opacity=${this.opacity}
            rotation="90 0 0"
            position="0 1 0"
          ></a-rounded>

          <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color1}
            top-left-radius="0.2"
            bottom-left-radius="0"
            top-right-radius="0"
            bottom-right-radius="0.2"
            opacity=${this.opacity}
            rotation="0 0 0"
            position="0 0 0"
          ></a-rounded>
          <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color2}
            top-left-radius="0.2"
            bottom-left-radius="0"
            top-right-radius="0"
            bottom-right-radius="0.2"
            opacity=${this.opacity}
            rotation="0 -90 0"
            position="0 0 0"
          ></a-rounded>
          <a-rounded
            width="0.985"
            height="0.985"
            color=${this.color3}
            top-left-radius="0.2"
            bottom-left-radius="0"
            top-right-radius="0"
            bottom-right-radius="0.2"
            opacity=${this.opacity}
            rotation="90 0 0"
            position="0 0 0"
          ></a-rounded>
        </a-entity>
      `;
  }
}
