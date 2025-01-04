import { Component } from 'aframe';
import { DXRProvider } from '../classes/dxr-provider';
import { providers } from '../stores/providers';

const THREE = AFRAME.THREE;

export const injectable =
  (_options?: { networked?: boolean }) =>
  <T extends typeof DXRProvider>(ElementClass: T) => {
    const options = {
      networked: false,
      ..._options,
    };

    const elementName = `_${THREE.MathUtils.generateUUID().toLowerCase()}`;
    providers.set(ElementClass, elementName);

    ElementClass.__ELEMENT_NAME__ = elementName;
    ElementClass.__NETWORKED__ = options.networked;
    ElementClass.__INTERNAL_PROPERTIES__ =
      ElementClass.__INTERNAL_PROPERTIES__ || [];
    ElementClass.schema = ElementClass.schema || {};
    ElementClass.dependencies = ElementClass.dependencies || [];
    ElementClass.multiple = false;
    ElementClass.mappings = ElementClass.mappings || {};

    const instances = new Map<Component, DXRProvider>();

    const getInstance = (aframeInstance: Component) => {
      let instance = instances.get(aframeInstance);

      if (!instance) {
        instance = new ElementClass();
        (
          aframeInstance as unknown as { __AFRAME_ELEMENT__: DXRProvider }
        ).__AFRAME_ELEMENT__ = instance;
        instance.__AFRAME_INSTANCE__ = aframeInstance;
        instances.set(aframeInstance, instance);
      }
      return instance;
    };

    const aFrameElementDefinition = {
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
        getInstance(this as Component).init();
      },
      pause: function (): void {
        getInstance(this as Component).pause();
      },
      play: function (): void {
        getInstance(this as Component).play();
      },
      remove: function (): void {
        getInstance(this as Component).remove();
        instances.delete(this as Component);
      },
      tick: function (time: number, timeDelta: number): void {
        getInstance(this as Component).tick(time, timeDelta);
      },
      tock: function (time: number, timeDelta: number, camera: any): void {
        getInstance(this as Component).tock(time, timeDelta, camera);
      },
      updateSchema: function (): void {
        getInstance(this as Component).updateSchema();
      },
      update: function (oldData: unknown): void {
        getInstance(this as Component).update(oldData);
        getInstance(this as Component).el.dispatchEvent(
          new CustomEvent('__META_UPDATE__'),
        );
      },
    };

    AFRAME.registerComponent(elementName, aFrameElementDefinition);
  };
