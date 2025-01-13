import { Entity as _Entity, Scene as _Scene } from 'aframe';
import { TemplateResult as _TemplateResult } from 'lit';
import './src/lib/components/hide-on-ar';
export declare const THREE: typeof import('three');
export { html, noChange, nothing } from 'lit';
export {
  customElement as customHtmlElement,
  property as propertyHtml,
  state as stateHtml,
} from 'lit/decorators.js';
export { unsafeHTML } from 'lit/directives/unsafe-html.js';
export { DXRElement } from './src/lib/classes/dxr-element';
export { DXRHtmlElement } from './src/lib/classes/dxr-html-element';
export { DXRProvider } from './src/lib/classes/dxr-provider';
export { customElement } from './src/lib/decorators/custom-element';
export { inject } from './src/lib/decorators/inject';
export { injectHtml } from './src/lib/decorators/inject-html';
export { injectable } from './src/lib/decorators/injectable';
export { property } from './src/lib/decorators/property';
export { state } from './src/lib/decorators/state';
export type TemplateResult = _TemplateResult;
export type Entity = _Entity;
export type Scene = _Scene;
