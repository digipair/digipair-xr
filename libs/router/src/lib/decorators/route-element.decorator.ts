import { customElement, DXRElement, DXRProvider } from '@digipair-xr/core';
import {
  PreventAndRedirectCommands,
  Router,
  RouterLocation,
} from '@vaadin/router';

declare const AFRAME: any;

export const routeElement =
  <P extends typeof DXRProvider>(
    elementName: string,
    _options?: { networked?: boolean; providers?: P[] },
  ) =>
  <E extends typeof DXRElement>(ElementClass: E) => {
    customElement(elementName, _options)(ElementClass);

    AFRAME.primitives.primitives[elementName]['prototype'].onBeforeEnter = (
      _location: RouterLocation,
      commands: PreventAndRedirectCommands,
      router: Router,
    ) => {
      if ((router as any).__outlet.querySelector(`:scope > ${elementName}`)) {
        return commands.prevent();
      }

      return;
    };
  };
