import {
  customElement,
  DXRElement,
  html,
  property,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';

@customElement('experiences-with-hands-stand')
export class StandElement extends DXRElement {
  @property()
  pins: any;

  override render(): TemplateResult {
    const pins = this.pins;
    const element = pins.element;
    const attributes = pins.attributes;
    const options = {
      editable: pins.editable,
      shape: pins.shape,
      dynamic: pins.dynamic,
      import: pins.import,
    };

    return html`
      <a-rounded color="#ffffff" width="0.5" height="0.5" radius="0.045">
        ${unsafeHTML(`
          <dxr-html
            position="0.245 0.5 0.001"
            width="235px"
            style="color: #000000; text-align: right;"
          >
            <template>
              <img src=${pins.image} width="200px;" />
              <h2>${pins.name}</h2>
              <h4>Prix: 64.99</h4>
              <p style="text-align: left;">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </template>
          </dxr-html>
        `)}

        <a-rounded
          color="#ffffff"
          width="0.5"
          height="0.2"
          radius="0.045"
          position="0 -0.15 0"
          rotation="90 0 0"
        ></a-rounded>

        <a-entity
          networked="template: #element-template; persistent: true; owner: scene; networkId: experiences-with-hands-stand-item;"
          dxr-element=${`element: ${btoa(
            encodeURIComponent(JSON.stringify(element)),
          )}; attributes: ${btoa(
            encodeURIComponent(JSON.stringify(attributes)),
          )}; options: ${btoa(encodeURIComponent(JSON.stringify(options)))};`}
          position="0.24 -0.143 0.126"
          rotation="0 90 0"
        ></a-entity>
      </a-rounded>
    `;
  }
}
