import {
  customElement,
  DXRElement,
  html,
  inject,
  state,
  TemplateResult,
  unsafeHTML,
} from '@digipair-xr/core';
import { PlayerProvider } from '../player/player.provider';

declare const NAF: any;
declare const AFRAME: any;

@customElement('dxr-element')
export class ElementElement extends DXRElement {
  @state()
  element!: string;

  @state()
  attributes: any = {};

  @state()
  options: any = {};

  @inject()
  private playerProvider!: PlayerProvider;

  private template!: string;

  private updateOptions(editing: boolean): void {
    const options = this.options;
    const type = 'static';

    if (!options.dynamic && this.el.getAttribute('body').type !== type) {
      this.el.setAttribute('body', { type });
    }

    this.options = { ...options, editing };
  }

  override init(): void {
    const options = this.options;

    if (options.editable) {
      this.el.setAttribute('editable', '');
      this.el.addEventListener('grab-start', () => {
        this.playerProvider.takeOwnership(this.el);
        this.updateOptions(true);
      });
      this.el.addEventListener('grab-end', () => {
        this.updateOptions(false);
      });
    }

    if (options.import) {
      import(options.import);
    }
  }

  public override render(): TemplateResult | null {
    if (!this.element || !this.attributes) {
      return null;
    }

    const element = this.element;
    const attributes = this.attributes;
    const options = this.options;

    if (options.editable && (!options.editing || NAF.utils.isMine(this.el))) {
      const type =
        options.dynamic || options.editing
          ? 'type: dynamic; shape: none;'
          : 'type: static; shape: none;';

      !this.el.hasAttribute('grabbable') &&
        this.el.setAttribute('grabbable', '');
      !this.el.hasAttribute('stretchable') &&
        this.el.setAttribute('stretchable', '');
      (!this.el.hasAttribute('body') ||
        this.el.getAttribute('body').type !== type) &&
        this.el.setAttribute('body', type);
      !this.el.hasAttribute('shape') &&
        this.el.setAttribute('shape', options.shape);
      !this.el.hasAttribute('collision-filter') &&
        this.el.setAttribute(
          'collision-filter',
          'collidesWith: hand, surface;',
        );
    } else {
      this.el.hasAttribute('grabbable') && this.el.removeAttribute('grabbable');
      this.el.hasAttribute('stretchable') &&
        this.el.removeAttribute('stretchable');
      this.el.hasAttribute('body') && this.el.removeAttribute('body');
      this.el.hasAttribute('shape') && this.el.removeAttribute('shape');
      this.el.hasAttribute('collision-filter') &&
        this.el.removeAttribute('collision-filter');
    }

    if (this.options.inline) {
      const elementAttributes = this.getExtraComponents(element, attributes);
      Object.getOwnPropertyNames(elementAttributes).forEach((attribute) =>
        this.el.setAttribute(attribute, elementAttributes[attribute]),
      );

      return null;
    }

    const template = `<${this.element} ${Object.getOwnPropertyNames(attributes)
      .map((property) => `${property}="${attributes[property]}"`)
      .join(' ')}></${this.element}>`;

    if (this.template === template) {
      return null;
    }
    this.template = template;

    return html`${unsafeHTML(this.template)}`;
  }

  private getExtraComponents(element: string, properties: any): any {
    const utils = AFRAME.utils;
    const primitives = AFRAME.primitives;
    const attributes = Object.keys(properties).map((property: string) => ({
      name: property,
      value: properties[property],
    }));

    // Gather component data from default components.
    const data = utils.clone(
      primitives.primitives[element]?.prototype
        .defaultComponentsFromPrimitive || {},
    );
    const mappings = primitives.primitives[element]?.prototype.mappings || {};

    // Gather component data from mappings.
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const mapping = mappings[attr.name];
      if (mapping) {
        const path = utils.entity.getComponentPropertyPath(mapping);
        if (path.constructor === Array) {
          data[path[0]] = data[path[0]] || {};
          data[path[0]][path[1]] = attr.value.trim();
        } else {
          data[path] = attr.value.trim();
        }
        continue;
      } else {
        data[attr.name] = attr.value;
      }
    }

    return data;
  }
}
