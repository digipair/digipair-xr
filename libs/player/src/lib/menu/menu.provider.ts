import { DXRProvider, injectable, state } from '@digipair-xr/core';

@injectable()
export class MenuProvider extends DXRProvider {
  @state()
  panel = 'pins';
}
