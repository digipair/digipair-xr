import 'reflect-metadata';
import { DXRElement } from '../classes/dxr-element';
import { DXRProvider } from '../classes/dxr-provider';
import { providers } from '../stores/providers';

export const injectHtml = () => (target: Element, property: string) => {
  const type = Reflect.getMetadata('design:type', target, property);
  const providersByElement = new Map<DXRElement, DXRProvider>();

  Object.defineProperty(target, property, {
    get() {
      let provider = providersByElement.get(this);

      if (!provider) {
        const el = this.closest(`[meta-html-container]`)
          .__DXR_ELEMENT_INSTANCE__.el as any;
        const name = providers.get(type);
        provider = (
          el.closest(`[${name}]`) ||
          el.sceneEl.querySelector(`meta-scene-container[${name}]`)
        )?.components[name].__AFRAME_ELEMENT__;

        if (!provider) {
          throw new Error(
            `${name} cannot be injected. May be it is not correctly provided ?`,
          );
        }

        const listener = () => {
          this.requestUpdate();
        };
        provider.el.addEventListener('__DXR_UPDATE__', listener);
        this.__SUBSCRIPTIONS__ = this.__SUBSCRIPTIONS__ || [];
        this.__SUBSCRIPTIONS__.push({
          el: provider.el,
          type: '__DXR_UPDATE__',
          listener,
        });

        providersByElement.set(this, provider);
      }

      return provider;
    },
    enumerable: true,
    configurable: true,
  });
};
