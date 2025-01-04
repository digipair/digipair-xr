// Code for a component implementing texture coming from a camera
//
// Original code:
//   https://wirewhiz.com/how-to-use-a-cameras-output-as-a-texture-in-aframe/
//
import {
  customElement,
  DXRElement,
  Entity,
  html,
  property,
  TemplateResult,
  THREE,
} from '@digipair-xr/core';

@customElement('dxr-camrender-camera')
export class CamrenderCameraElement extends DXRElement {
  @property({ default: 90 })
  fps!: number;

  @property({ default: 'dxr-camrender' })
  cid!: string;

  @property({ default: 300 })
  height!: 'number';

  @property({ default: 400 })
  width!: number;

  private renderer!: any;
  private canvasUpdate!: (t: number, dt: number) => void;

  override update(oldData: any): void {
    const data = this.data as any;
    const camera = this.el.querySelector(
      ':scope > [data-dxr-camrender-camera]',
    ) as Entity | null;

    if (!camera) {
      setTimeout(() => this.update(oldData), 1);
      return;
    }

    if (oldData.cid !== data.cid) {
      let assets = this.el.sceneEl?.querySelector(':scope > a-assets');
      if (!assets) {
        assets = document.createElement('a-assets');
        this.el.sceneEl?.appendChild(assets);
      }

      if (oldData.cid) {
        const oldCanvas = document.getElementById(oldData.cid);
        oldCanvas?.remove();
      }
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', data.cid);
      assets.appendChild(canvas);

      // Create renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
      });
      // Set properties for renderer DOM element
      this.renderer.setPixelRatio(window.devicePixelRatio);
      (this.renderer.domElement as any).crossorigin = 'anonymous';
    }
    if (oldData.width !== data.width || oldData.height !== data.height) {
      // Set size of canvas renderer
      this.renderer.setSize(data.width, data.height);
      this.renderer.domElement.height = data.height;
      this.renderer.domElement.width = data.width;
    }
    if (oldData.fps !== data.fps) {
      // Set how often to call tick
      this.canvasUpdate = AFRAME.utils.throttleTick(
        () =>
          this.renderer.render(
            ((this.el as Entity).sceneEl as Entity).object3D,
            (camera.object3DMap as any).camera,
          ),
        1000 / data.fps,
        this,
      );
    }
  }

  override remove(): void {
    const canvas = document.getElementById(this.cid);
    canvas?.remove();
  }

  override tick(t: number, dt: number): void {
    this.canvasUpdate?.(t, dt);
  }

  override render(): TemplateResult {
    return html`
      <a-entity
        data-dxr-camrender-camera
        camera="active: false; fov: 40; zoom: 1;"
      ></a-entity>
    `;
  }
}
