import { DXRProvider, inject, injectable, state } from '@digipair-xr/core';
import { PlayerProvider } from '@digipair-xr/player';
import { RouterProvider } from '@digipair-xr/router';

const SESSION_SHARED = false;

@injectable({ networked: true })
export class SessionProvider extends DXRProvider {
  @state()
  route = '';

  @inject()
  routerProvider: RouterProvider;

  @inject()
  playerProvider: PlayerProvider;

  override update() {
    if (SESSION_SHARED) {
      this.routerProvider.go(this.route);
    }
  }

  go(route: string) {
    if (SESSION_SHARED) {
      this.route = route;
      return;
    }

    this.routerProvider.go(route);
  }

  startSession(session: string): void {
    if (SESSION_SHARED) return;

    this.playerProvider.startSession(session);
  }

  stopSession(): void {
    if (SESSION_SHARED) return;

    this.playerProvider.stopSession();
  }
}
