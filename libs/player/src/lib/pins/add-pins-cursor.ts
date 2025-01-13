import {
  customElement,
  DXRElement,
  Entity,
  html,
  inject,
  nothing,
  property,
  state,
  THREE,
} from '@digipair-xr/core';
import { PlayerProvider } from '../player/player.provider';

@customElement('dxr-player-menu-add-pins-cursor')
export class AddPinsCursorElement extends DXRElement {
  @property()
  vrmode!: boolean;

  @state()
  cursorvisible = false;

  @inject()
  playerProvider!: PlayerProvider;

  private add = (event: any) => {
    const cursor: any = this.vrmode
      ? (this.el.sceneEl as Entity).querySelector(
          '[laser-controls="hand: right;"]',
        )
      : (this.el.sceneEl as Entity).querySelector('[cursor]');
    const enable =
      cursor.components.raycaster.intersectedEls[0]?.hasAttribute('placing');

    if (!enable) {
      return;
    }

    const point = event.detail.intersection.point;
    const rotationMatrix = new THREE.Matrix4().extractRotation(
      event.detail.intersectedEl.object3D.matrixWorld,
    );
    const normal = event.detail.intersection.face.normal
      .clone()
      .applyMatrix4(rotationMatrix);
    const cursorData = this.playerProvider.customcursorData;

    const el = this.playerProvider.addNetworkedElement(
      cursorData.component,
      {
        ...(cursorData.attributes || {}),
        position: undefined,
        rotation: undefined,
      },
      null,
      {
        editable: cursorData.editable,
        name: cursorData.name,
        shape: cursorData.shape,
        dynamic: cursorData.dynamic,
        import: cursorData.import,
      },
    );

    el.object3D.position.set(point.x, point.y, point.z);
    el.object3D.lookAt(point.x + normal.x, point.y, point.z + normal.z);

    el.object3D.updateMatrix();
    const matrix = el.object3D.matrix.clone();
    const position = cursorData.attributes?.position
      ?.split(' ')
      .map((place: string) => +place) || [0, 0, 0];
    const rotation = cursorData.attributes?.rotation
      ?.split(' ')
      .map((place: string) => THREE.MathUtils.degToRad(+place)) || [0, 0, 0];

    el.object3D.position.set(position[0], position[1], position[2]);
    el.object3D.rotation.set(rotation[0], rotation[1], rotation[2]);
    el.object3D.applyMatrix4(matrix);

    this.playerProvider.stopCursor();
  };

  private computePinsPosition() {
    const cursor: any = this.vrmode
      ? (this.el.sceneEl as Entity).querySelector(
          '[laser-controls="hand: right;"]',
        )
      : (this.el.sceneEl as Entity).querySelector('[cursor]');
    const visible =
      cursor.components.raycaster.intersectedEls[0]?.hasAttribute('placing');

    if (visible) {
      const { point } = cursor.components.raycaster.rawIntersections[0];
      const el = cursor.components.raycaster.intersectedEls[0];
      const rotationMatrix = new THREE.Matrix4().extractRotation(
        el.object3D.matrixWorld,
      );
      const normal = cursor.components.raycaster.intersections[0]?.face.normal
        .clone()
        .applyMatrix4(rotationMatrix);

      this.el.object3D.position.set(point.x, point.y, point.z);
      this.el.object3D.lookAt(point.x + normal.x, point.y, point.z + normal.z);

      if (!this.cursorvisible) {
        this.cursorvisible = true;
      }
    } else {
      if (this.cursorvisible) {
        this.cursorvisible = false;
      }
    }
  }

  override init(): void {
    const cursor = this.el.sceneEl?.querySelector('[cursor]');
    const lasers = this.el.sceneEl?.querySelectorAll('[laser-controls]') || [];

    cursor?.addEventListener('click', this.add);
    lasers.forEach((el) => {
      el.addEventListener('click', this.add);
    });
  }

  override tick(): void {
    this.computePinsPosition();
  }

  override remove(): void {
    const cursor = this.el.sceneEl?.querySelector('[cursor]');
    const lasers = this.el.sceneEl?.querySelectorAll('[laser-controls]') || [];

    cursor?.removeEventListener('click', this.add);
    lasers.forEach((el) => {
      el.removeEventListener('mousemove', this.add);
      el.removeEventListener('click', this.add);
    });
  }

  override render() {
    const cursorData = this.playerProvider.customcursorData;

    return html`
      ${!this.cursorvisible || !cursorData
        ? nothing
        : html`
            <a-entity
              geometry=${cursorData.placeholder.geometry}
              position=${cursorData.placeholder.position || '0 0 0'}
              rotation=${cursorData.placeholder.rotation || '0 0 0'}
              material="color: #d6d6d6; opacity: 0.3;"
            ></a-entity>
          `}
    `;
  }
}
