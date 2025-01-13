/* eslint-disable @typescript-eslint/no-explicit-any */
import { SinglePropertySchema } from 'aframe';
import 'reflect-metadata';
import { DXRElement } from '../classes/dxr-element';

export const property =
  (options?: { default: any }) =>
  <T extends DXRElement>(target: T, property: string) => {
    const type = Reflect.getMetadata('design:type', target, property);

    if (!(target.constructor as typeof DXRElement).schema) {
      (target.constructor as typeof DXRElement).schema = {};
    }
    (
      (target.constructor as typeof DXRElement).schema as {
        [key: string]: SinglePropertySchema<unknown>;
      }
    )[property] = {
      ...(options?.default !== undefined
        ? {
            default:
              type === Number || type === Boolean || type === String
                ? options.default
                : btoa(encodeURIComponent(JSON.stringify(options.default))),
          }
        : {}),
      type:
        type === Number ? 'number' : type === Boolean ? 'boolean' : 'string',
      parse: function (value: string) {
        const result =
          type === String || !value
            ? value
            : type === Number || type === Boolean
              ? JSON.parse(value)
              : JSON.parse(decodeURIComponent(atob(value)));

        return result;
      },
    };

    Object.defineProperty(target, property, {
      get() {
        return this.data[property];
      },
      enumerable: true,
      configurable: true,
    });
  };
