import { DXRElement, Entity, THREE } from '@digipair-xr/core';

function getPathTo(element: Element, root: Element): string {
  if (element.id !== '') return 'id("' + element.id + '")';
  if (element === root) return element.tagName;

  let ix = 0;
  const siblings = (element.parentNode as Element).childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i] as Element;
    if (sibling === element)
      return (
        getPathTo(element.parentNode as Element, root) +
        '/' +
        element.tagName +
        '[' +
        (ix + 1) +
        ']'
      );
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }

  return '';
}

function kebabCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export abstract class MeshCommon extends DXRElement {
  abstract object: string;
  abstract shared: boolean;

  private meshChanged = (event: any) => {
    if (!event.target.contains(this.el) || event.target === this.el) {
      return;
    }

    this.updateMesh(event.detail.object);
  };

  private get parentEl(): Entity | null | undefined {
    return this.el.parentElement?.closest(
      `dxr-mesh, dxr-spline, a-gltf-model, a-obj-model`,
    );
  }

  override init(): void {
    const parentEl = this.parentEl;

    if (parentEl) {
      const mesh = parentEl.object3D;
      this.updateMesh(mesh);

      parentEl.addEventListener('object3dset', this.meshChanged);
    }
  }

  override remove(): void {
    this.parentEl?.removeEventListener('object3dset', this.meshChanged);
  }

  override update(): void {
    const parentEl = this.parentEl;

    if (parentEl) {
      const mesh = parentEl.object3D;
      this.updateMesh(mesh);
    }
  }

  protected async updateMesh(parentMesh: any): Promise<void> {
    const mesh = !this.object
      ? parentMesh
      : (parentMesh?.getObjectByName(this.object) as any);

    if (!mesh) return;
    this.el.setObject3D('mesh', mesh);

    if (this.shared) {
      this.updateShare();
    }
  }

  protected updateShare(): void {
    const localPosition = this.el.object3D.children[0].position;
    const scale = new THREE.Vector3();
    this.el.object3D.getWorldScale(scale);
    const box = new THREE.Box3();
    box.setFromObject(this.el.object3D.children[0]);
    const worldSize = new THREE.Vector3();
    box.getSize(worldSize);
    const localSize = {
      x: worldSize.x / scale.x,
      y: worldSize.y / scale.y,
      z: worldSize.z / scale.z,
    };

    this.el.setAttribute(
      'dxr-element',
      `element: ${btoa(
        encodeURIComponent(JSON.stringify('a-entity')),
      )}; attributes: ${btoa(
        encodeURIComponent(JSON.stringify({})),
      )}; options: ${btoa(
        encodeURIComponent(
          JSON.stringify({
            editable: true,
            shape: `shape: box; halfExtents: ${localSize.x / 2} ${
              localSize.y / 2
            } ${localSize.z / 2}; offset: ${localPosition.x} ${
              localPosition.y
            } ${localPosition.z};`,
            dynamic: false,
            inline: true,
          }),
        ),
      )};`,
    );

    this.el.setAttribute(
      'networked',
      `template: #element-template; persistent: true; owner: scene; networkId: ${kebabCase(
        getPathTo(this.el, this.el.sceneEl as Element),
      )};`,
    );
  }
}
