import { Component, SinglePropertySchema } from 'aframe';
import { DXRElement } from '../classes/dxr-element';
import { DXRProvider } from '../classes/dxr-provider';
import '../components/networked-element';
import { subscription } from '../interfaces/subscription';
import { providers } from '../stores/providers';

export const customElement =
  <P extends typeof DXRProvider>(
    elementName: string,
    _options?: { networked?: boolean; providers?: P[] },
  ) =>
  <E extends typeof DXRElement>(ElementClass: E) => {
    const instances = new Map<Component, DXRElement>();
    const options = {
      networked: false,
      providers: [],
      ..._options,
    };

    ElementClass.__ELEMENT_NAME__ = elementName;
    ElementClass.__NETWORKED__ = options.networked;
    ElementClass.__INTERNAL_PROPERTIES__ =
      ElementClass.__INTERNAL_PROPERTIES__ || [];
    ElementClass.schema = ElementClass.schema || {};
    ElementClass.dependencies = ElementClass.dependencies || [];
    ElementClass.multiple = false;
    ElementClass.mappings = ElementClass.mappings || {};

    const getInstance = (aframeInstance: Component) => {
      let instance = instances.get(aframeInstance);

      if (!instance) {
        instance = new ElementClass();
        instance.__AFRAME_INSTANCE__ = aframeInstance;
        instances.set(aframeInstance, instance);
      }
      return instance;
    };

    const aFrameElementDefinition = {
      __META_INITIALIZED__: false,
      get schema() {
        return ElementClass.schema;
      },
      get dependencies() {
        return ElementClass.dependencies;
      },
      get multiple() {
        return ElementClass.multiple;
      },
      init: function (): void {
        // defer init for providers
        setTimeout(() => {
          getInstance(this as unknown as Component).init();
          this.__META_INITIALIZED__ = true;
          getInstance(this as unknown as Component).requestUpdate();
        }, 1);
      },
      pause: function (): void {
        getInstance(this as unknown as Component).pause();
      },
      play: function (): void {
        getInstance(this as unknown as Component).play();
      },
      remove: function (): void {
        const __SUBSCRIPTIONS__ = ((this as any).__SUBSCRIPTIONS__ ||
          []) as subscription[];
        __SUBSCRIPTIONS__.forEach(({ el, type, listener }) => {
          el.removeEventListener(type, listener);
        });
        getInstance(this as unknown as Component).remove();
        instances.delete(this as unknown as Component);
      },
      tick: function (time: number, timeDelta: number): void {
        getInstance(this as unknown as Component).tick(time, timeDelta);
      },
      tock: function (time: number, timeDelta: number, camera: any): void {
        getInstance(this as unknown as Component).tock(time, timeDelta, camera);
      },
      updateSchema: function (): void {
        getInstance(this as unknown as Component).updateSchema();
      },
      update: function (oldData: unknown): void {
        getInstance(this as unknown as Component).update(oldData);

        if (this.__META_INITIALIZED__) {
          getInstance(this as unknown as Component).requestUpdate();
        }
      },
    };

    AFRAME.registerComponent(elementName, aFrameElementDefinition);

    const networkedProviders = options.providers
      .filter((provider) => provider.__NETWORKED__)
      .map((key) => ({
        component: providers.get(key),
        properties: Object.keys(key.schema).filter(
          (property) =>
            !!(
              key.schema as {
                [key: string]: SinglePropertySchema<unknown>;
              }
            )[property].default,
        ),
      }));

    if (options.networked || networkedProviders.length > 0) {
      AFRAME.registerPrimitive(elementName, {
        defaultComponents: {
          'networked-element': {
            element: elementName,
            providers: options.providers.map((key) => providers.get(key)),
            networkedElements: [
              ...(!options.networked
                ? []
                : ElementClass.__INTERNAL_PROPERTIES__.map(
                    (property: string) => ({
                      component: elementName,
                      property,
                    }),
                  )),
              ...options.providers
                .filter((provider) => provider.__NETWORKED__)
                .map((provider) => ({
                  component: providers.get(provider),
                  properties: provider.__INTERNAL_PROPERTIES__,
                }))
                .flat(),
            ],
          },
        },
        get mappings() {
          return Object.assign(
            {},
            ...Object.keys(ElementClass.schema).map((key) => ({
              [`${key}`]: `${elementName}.${key}`,
            })),
          );
        },
      });
    } else {
      AFRAME.registerPrimitive(elementName, {
        defaultComponents: {
          [elementName]: {},
          ...Object.fromEntries(
            options.providers.map((key) => [providers.get(key), {}]),
          ),
        },
        get mappings() {
          return Object.assign(
            {},
            ...Object.keys(ElementClass.schema).map((key) => ({
              [`${key}`]: `${elementName}.${key}`,
            })),
          );
        },
      });
    }
  };
