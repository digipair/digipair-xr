import {
  customElement,
  DXRElement,
  Entity,
  html,
  property,
  TemplateResult,
  THREE,
} from '@digipair-xr/core';

@customElement('dxr-screen-shared-webcam')
export class ScreenSharedWebcamElement extends DXRElement {
  @property()
  screenid!: string;

  @property()
  curved!: boolean;

  override init(): void {
    setTimeout(() => this.initTexture(), 500);
  }

  private initTexture() {
    if (!this.curved) {
      return;
    }

    const map = (
      (
        (
          this.el.querySelector(':scope > a-entity') as Entity
        ).object3D.getObjectByProperty('type', 'Mesh') as any
      )?.material as any
    ).map;

    if (!map) {
      setTimeout(() => this.initTexture(), 500);
      return;
    }
    map.wrapT = map.wrapS = THREE.RepeatWrapping;
    map.repeat.set(-1, 1);
  }

  override render(): TemplateResult {
    return html`
      <a-entity
        material=${this.curved
          ? `side: back; repeat: -1 1; src: #screen-shared-${this.screenid};`
          : `side: front; src: #screen-shared-${this.screenid};`}
        geometry=${this.curved
          ? `primitive: cylinder; openEnded: true; thetaLength: 46; thetaStart: 157; radius: 2; height: 0.9;`
          : `primitive: plane; width: 1.6; height: 0.9;`}
        position=${this.curved ? `0 0 2` : `0 0 0`}
        networked-video-source
      ></a-entity>
    `;
  }
}
