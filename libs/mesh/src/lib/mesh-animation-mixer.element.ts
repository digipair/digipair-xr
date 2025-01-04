import { customElement, Entity, property } from '@digipair-xr/core';
import { MeshCommon } from './mesh.common';

@customElement('dxr-mesh-animation-mixer')
export class MeshAnimationMixerElement extends MeshCommon {
  @property()
  object!: string;

  @property({ default: false })
  shared!: boolean;

  @property()
  url!: string;

  @property()
  mixer!: string;

  @property({ default: 'AuxScene' })
  origin!: string;

  private async initialization(url: string): Promise<void> {
    if (!url) {
      return;
    }

    await this.addAnimations(url);
  }

  async addAnimations(url: string) {
    const animationsEl = await this.getAnimationsElement(url);

    this.el.getObject3D('mesh').animations =
      animationsEl.object3D.getObjectByName(this.origin)?.animations || [];
  }

  private getAnimationsElement(url: string): Promise<Entity> {
    return new Promise((resolve) => {
      let animationsEl: Entity | null | undefined =
        this.el.sceneEl?.querySelector(
          `:scope > [data-dxr-mesh-animation-mixer][url="${url}"]`,
        );

      if (!animationsEl) {
        animationsEl = document.createElement('a-gltf-model');
        animationsEl.setAttribute('src', url);
        animationsEl.setAttribute('visible', false);
        animationsEl.setAttribute('data-dxr-mesh-animation-mixer', '');

        animationsEl.addEventListener('model-loaded', ({ srcElement }: any) => {
          (animationsEl as Entity).setAttribute(
            'data-dxr-mesh-animation-mixer-ready',
            '',
          );
          resolve(srcElement as Entity);
        });

        this.el.sceneEl?.append(animationsEl);
      } else if (
        !animationsEl.hasAttribute('data-dxr-mesh-animation-mixer-ready')
      ) {
        animationsEl.addEventListener('model-loaded', ({ srcElement }: any) => {
          resolve(srcElement as Entity);
        });
      } else {
        resolve(animationsEl);
      }
    });
  }

  override async updateMesh(parentMesh: any): Promise<void> {
    const mesh = !this.object
      ? parentMesh
      : (parentMesh?.getObjectByName(this.object) as any);

    if (!mesh) return;
    this.el.setObject3D('mesh', mesh);

    if (this.shared) {
      this.updateShare();
    }

    await this.initialization(this.url);
    this.el.setAttribute('animation-mixer', this.mixer);
  }
}
