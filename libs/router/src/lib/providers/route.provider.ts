import { DXRProvider, injectable } from '@digipair-xr/core';
import { IndexedParams, Router, RouterLocation } from '@vaadin/router';

@injectable()
export class RouteProvider extends DXRProvider {
  private routers!: { [key: string]: Router };

  override init(): void {
    this.routers = {};
  }

  setRouter(router: Router, outlet: string) {
    this.routers[outlet] = router;
  }

  location(outlet = 'default'): RouterLocation {
    return this.routers[outlet].location;
  }

  params(outlet = 'default'): IndexedParams {
    return this.routers[outlet].location.params;
  }
}
