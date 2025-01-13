import {
  DXRProvider,
  Entity,
  inject,
  injectable,
  state,
  THREE,
} from '@digipair-xr/core';
import { PlayerProvider } from '@digipair-xr/player';
import * as md5 from 'md5';

declare const NAF: any;

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

@injectable({
  networked: true,
})
export class ScreenSharedProvider extends DXRProvider {
  @state()
  menuVisible = false;

  @inject()
  playerProvider!: PlayerProvider;

  elementid!: string;

  private streamId!: string;
  private stream: any;

  private clientConnected = () => {
    if (!this.stream) {
      return;
    }
    NAF.connection.adapter.addLocalMediaStream(this.stream, this.streamId);
  };

  override init(): void {
    this.elementid = (md5 as any).default(
      getPathTo(this.el, this.el.sceneEl as Element),
    );
    this.streamId = '';
    this.stream = null;
    document.body.addEventListener('clientConnected', this.clientConnected);
  }

  override remove(): void {
    this.removeScreen();
    document.body.removeEventListener('clientConnected', this.clientConnected);
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  async openDesktop(options: { curved?: boolean }): Promise<void> {
    this.menuVisible = false;
    this.streamId = THREE.MathUtils.generateUUID();
    const screenEl = this.playerProvider.addNetworkedElement(
      'dxr-screen-shared-desktop',
      {
        screenid: `${this.elementid}`,
        streamid: this.streamId,
        curved: options.curved,
      },
    );
    this.setScreenPosition(screenEl);

    const videoEl = this.videoElement();
    this.stream = await navigator.mediaDevices.getDisplayMedia();
    NAF.connection.adapter.addLocalMediaStream(this.stream, this.streamId);
    (videoEl as any).srcObject = this.stream;
  }

  async openWebcam(options: { curved?: boolean }): Promise<void> {
    this.menuVisible = false;
    const screenEl = this.playerProvider.addNetworkedElement(
      'dxr-screen-shared-webcam',
      {
        screenid: `${this.elementid}`,
        curved: options.curved,
      },
    );
    this.setScreenPosition(screenEl);

    const videoEl = this.videoElement();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    (videoEl as any).srcObject = stream;
  }

  stop(): void {
    this.menuVisible = false;

    if (this.streamId) {
      NAF.connection.adapter.removeLocalMediaStream(this.streamId);
      this.streamId = '';
      this.stream = null;
    }

    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`,
    ) as Entity;
    this.playerProvider.removeNetworkedElement(
      screenEl.parentElement as Entity,
    );
  }

  private setScreenPosition(screenEl: Entity): void {
    const matrix = this.el.object3D.matrixWorld.clone();
    const scale = new THREE.Vector3();
    this.el.object3D.getWorldScale(scale);

    screenEl.object3D.applyMatrix4(matrix);
    screenEl.object3D.scale.set(scale.x, scale.y, scale.z);
  }

  private videoElement(): Element {
    let videoEl = this.el.sceneEl?.querySelector(
      `#screen-shared-${this.elementid}`,
    );

    if (!videoEl) {
      let assets = this.el.sceneEl?.querySelector(':scope > a-assets');
      if (!assets) {
        assets = document.createElement('a-assets');
        this.el.sceneEl?.appendChild(assets);
      }

      videoEl = document.createElement('video');
      videoEl.setAttribute('id', `screen-shared-${this.elementid}`);
      videoEl.setAttribute('playsinline', '');
      assets?.appendChild(videoEl);

      videoEl.addEventListener('loadedmetadata', () => {
        (videoEl as any).play();
      });
    }

    return videoEl;
  }

  private removeScreen() {
    const screenEl = this.el.sceneEl?.querySelector(
      `[screenid="${this.elementid}"]`,
    );
    const isMine = screenEl && NAF.utils.isMine(screenEl.parentElement);
    if (isMine) {
      this.stop();
    }

    const videoEl = this.el.sceneEl?.querySelector(
      `#screen-shared-${this.elementid}`,
    );
    videoEl?.remove();
  }
}
