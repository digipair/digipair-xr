import { customElement, DXRElement, Entity, property } from '@digipair-xr/core';
import { TalkingHead } from './talkinghead';

// function getPathTo(element: Element, root: Element): string {
//   if (element.id !== '') return 'id("' + element.id + '")';
//   if (element === root) return element.tagName;

//   let ix = 0;
//   const siblings = (element.parentNode as Element).childNodes;
//   for (let i = 0; i < siblings.length; i++) {
//     const sibling = siblings[i] as Element;
//     if (sibling === element)
//       return (
//         getPathTo(element.parentNode as Element, root) +
//         '/' +
//         element.tagName +
//         '[' +
//         (ix + 1) +
//         ']'
//       );
//     if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
//   }

//   return '';
// }

// function kebabCase(text: string) {
//   return text
//     .replace(/([a-z])([A-Z])/g, '$1-$2')
//     .replace(/[\s_]+/g, '-')
//     .toLowerCase();
// }

@customElement('dxr-talkinghead')
export class MeshElement extends DXRElement {
  @property({ default: 'F' })
  body!: string;

  @property({ default: 'en' })
  lipsyncLang!: string;

  @property({ default: 'neutral' })
  avatarMood!: string;

  @property({ default: false })
  avatarMute!: boolean;

  @property({ default: 0.2 })
  avatarIdleEyeContact!: number;

  @property({ default: 0.5 })
  avatarIdleHeadMove!: number;

  @property({ default: 0.5 })
  avatarSpeakingEyeContact!: number;

  @property({ default: 0.5 })
  avatarSpeakingHeadMove!: number;

  private meshChanged = (event: any) => {
    if (!event.target.contains(this.el) || event.target === this.el) {
      return;
    }

    this.updateMesh(event.detail.object);
  };

  private get parentEl(): Entity | null | undefined {
    return this.el.parentElement?.closest(`a-gltf-model`);
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
    const head = ((this.el as any).talkinghead = new TalkingHead({
      lipsyncModules: ['en', 'fi'],
      cameraView: 'upper',
    }));

    (this.el as any).speakFromTTS = async (...params: any[]) =>
      (this.el as any).talkinghead.speakFromTTS(...params);

    (this.el as any).speakText = async (...params: any[]) =>
      (this.el as any).talkinghead.speakText(...params);

    (this.el as any).setMood = async (...params: any[]) =>
      (this.el as any).talkinghead.setMood(...params);

    (this.el as any).speakEmoji = async (...params: any[]) =>
      (this.el as any).talkinghead.speakEmoji(...params);

    (this.el as any).speakBreak = async (...params: any[]) =>
      (this.el as any).talkinghead.speakBreak(...params);

    (this.el as any).speakMarker = async (...params: any[]) =>
      (this.el as any).talkinghead.speakMarker(...params);

    (this.el as any).start = async (...params: any[]) =>
      (this.el as any).talkinghead.start(...params);

    (this.el as any).stop = async (...params: any[]) =>
      (this.el as any).talkinghead.stop(...params);

    // Load and show the avatar
    try {
      await head.showAvatar(this.el, parentMesh.el, {
        body: 'F',
        avatarMood: 'neutral',
        lipsyncLang: 'en',
      });
    } catch (error) {
      console.log(error);
    }

    // const mesh = !this.object
    //   ? parentMesh
    //   : (parentMesh?.getObjectByName(this.object) as any);
    // if (!mesh) return;
    // this.el.setObject3D('mesh', mesh);
    // if (this.shared) {
    //   this.updateShare();
    // }
  }

  // protected updateShare(): void {
  //   const localPosition = this.el.object3D.children[0].position;
  //   const scale = new THREE.Vector3();
  //   this.el.object3D.getWorldScale(scale);
  //   const box = new THREE.Box3();
  //   box.setFromObject(this.el.object3D.children[0]);
  //   const worldSize = new THREE.Vector3();
  //   box.getSize(worldSize);
  //   const localSize = {
  //     x: worldSize.x / scale.x,
  //     y: worldSize.y / scale.y,
  //     z: worldSize.z / scale.z,
  //   };

  //   this.el.setAttribute(
  //     'dxr-element',
  //     `element: ${btoa(
  //       encodeURIComponent(JSON.stringify('a-entity')),
  //     )}; attributes: ${btoa(
  //       encodeURIComponent(JSON.stringify({})),
  //     )}; options: ${btoa(
  //       encodeURIComponent(
  //         JSON.stringify({
  //           editable: true,
  //           shape: `shape: box; halfExtents: ${localSize.x / 2} ${
  //             localSize.y / 2
  //           } ${localSize.z / 2}; offset: ${localPosition.x} ${
  //             localPosition.y
  //           } ${localPosition.z};`,
  //           dynamic: false,
  //           inline: true,
  //         }),
  //       ),
  //     )};`,
  //   );

  //   this.el.setAttribute(
  //     'networked',
  //     `template: #element-template; persistent: true; owner: scene; networkId: ${kebabCase(
  //       getPathTo(this.el, this.el.sceneEl as Element),
  //     )};`,
  //   );
  // }
}
