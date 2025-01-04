import { DXRProvider, Entity, injectable } from '@digipair-xr/core';
import { Route, Router } from '@vaadin/router';

@injectable()
export class RouterProvider extends DXRProvider {
  private routes!: { [key: string]: Route[] };
  private baseUrl!: string;

  override init(): void {
    this.routes = {};
    this.setBaseUrl('');
  }

  go(path: string) {
    if (path.substring(0, 1) !== '/') {
      Router.go(`${this.baseUrl}${path}`);
      return;
    }

    const baseUrl = document.querySelector('base')?.getAttribute('href') || '/';
    Router.go(`${baseUrl}${path.substring(1)}`);
  }

  setBaseUrl(base: string): void {
    this.baseUrl = `${
      document.querySelector('base')?.getAttribute('href') || '/'
    }${base}`;
  }

  createRouter(element: Entity, outlet: string): Router {
    const routes = this.routes[outlet];
    const router = new Router(element, { baseUrl: this.baseUrl });

    router.setRoutes(routes);

    return router;
  }

  setRoutes(routes: Route[], outlet = 'default'): void {
    this.routes[outlet] = routes;
  }
}
