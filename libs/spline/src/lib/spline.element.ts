import { customElement, DXRElement, property } from '@digipair-xr/core';
import SplineLoader from '@splinetool/loader';

@customElement('dxr-spline')
export class SplineElement extends DXRElement {
  @property()
  scene!: string;

  override update(): void {
    const loader = new SplineLoader();

    loader.load(this.scene, (splineScene) => {
      this.el.setObject3D('mesh', splineScene);
    });
  }
}
