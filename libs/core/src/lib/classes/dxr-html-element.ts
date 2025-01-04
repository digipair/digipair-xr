import { LitElement } from 'lit';
import { subscription } from '../interfaces/subscription';

export class DXRHtmlElement extends LitElement {
  protected override createRenderRoot(): any {
    return this;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    const __SUBSCRIPTIONS__ = ((this as any).__SUBSCRIPTIONS__ || []) as subscription[];
    __SUBSCRIPTIONS__.forEach(({ el, type, listener }) => {
        el.removeEventListener(type, listener);
    });
  }
}
