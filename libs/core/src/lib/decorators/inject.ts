import 'reflect-metadata';
import { DXRElement } from '../classes/dxr-element';
import { DXRProvider } from '../classes/dxr-provider';
import { providers } from '../stores/providers';

export const inject = () => (target: DXRProvider, property: string) => {
  const type = Reflect.getMetadata('design:type', target, property);
  const providersByElement = new Map<DXRElement, DXRProvider>();

  Object.defineProperty(target, property, {
    get() {
      let provider = providersByElement.get(this);

      if (!provider) {
        const name = providers.get(type);
        provider = (
          this.el.closest(`[${name}]`) ||
          this.el.sceneEl.querySelector(`meta-scene-container[${name}]`)
        )?.components[name].__AFRAME_ELEMENT__;

        if (!provider) {
          throw new Error(
            `${name} cannot be injected. May be it is not correctly provided ?`,
          );
        }

        const listener = () => {
          this.requestUpdate();
        };
        provider.el.addEventListener('__META_UPDATE__', listener);
        this.__SUBSCRIPTIONS__ = this.__SUBSCRIPTIONS__ || [];
        this.__SUBSCRIPTIONS__.push({
          el: provider.el,
          type: '__META_UPDATE__',
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
