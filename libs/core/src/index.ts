import { Entity as _Entity, Scene as _Scene } from 'aframe';
import { TemplateResult as _TemplateResult } from 'lit';
import './lib/components/hide-on-ar';

export const { THREE } = AFRAME;
export { html, noChange, nothing } from 'lit';
export {
  customElement as customHtmlElement,
  property as propertyHtml,
  state as stateHtml,
} from 'lit/decorators.js';
export { unsafeHTML } from 'lit/directives/unsafe-html.js';
export { DXRElement } from './lib/classes/dxr-element';
export { DXRHtmlElement } from './lib/classes/dxr-html-element';
export { DXRProvider } from './lib/classes/dxr-provider';
export { customElement } from './lib/decorators/custom-element';
export { inject } from './lib/decorators/inject';
export { injectHtml } from './lib/decorators/inject-html';
export { injectable } from './lib/decorators/injectable';
export { property } from './lib/decorators/property';
export { state } from './lib/decorators/state';

export type TemplateResult = _TemplateResult;
export type Entity = _Entity;
export type Scene = _Scene;
