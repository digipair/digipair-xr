import { customElement, property } from '@digipair-xr/core';
import { MeshCommon } from './mesh.common';

@customElement('dxr-mesh')
export class MeshElement extends MeshCommon {
  @property()
  object!: string;

  @property({ default: false })
  shared!: boolean;
}
