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

@customElement('dxr-teleportable-cursor')
export class TeleportableCursorElement extends DXRElement {
  @property()
  vrmode!: boolean;

  @property({ default: '#d6d6d6' })
  color!: string;

  @state()
  cursorvisible = false;

  @inject()
  playerProvider!: PlayerProvider;

  private currentPosition = { clientX: -1, clientY: -1 };
  private mouseDownPosition = { clientX: -1, clientY: -1 };

  private teleport = (event: any) => {
    if (!this.isClickAvailable()) {
      return;
    }

    const cursor: any = (this.el.sceneEl as Entity).querySelector('[cursor]');
    const enable =
      cursor.components.raycaster.intersectedEls[0]?.hasAttribute(
        'teleportable',
      );

    if (!enable) {
      return;
    }

    const { x, y, z } = event.detail.intersection.point;
    this.playerProvider.teleport(`${x} ${y} ${z}`);
  };

  private saveMousePosition = ({ clientX, clientY }: any) => {
    this.currentPosition = { clientX, clientY };
  };

  private saveTouchPosition = (event: any) => {
    const { clientX, clientY } = event.touches[0];
    this.currentPosition = { clientX, clientY };
  };

  private saveMouseDownPosition = () => {
    setTimeout(() => {
      this.mouseDownPosition = this.currentPosition;
    }, 1);
  };

  private isClickAvailable(): boolean {
    const mouseDownPosition = new THREE.Vector2(
      this.mouseDownPosition.clientX,
      this.mouseDownPosition.clientY,
    );
    const currentPosition = new THREE.Vector2(
      this.currentPosition.clientX,
      this.currentPosition.clientY,
    );
    const distance = mouseDownPosition.distanceTo(currentPosition);

    return distance < 5;
  }

  private computeCursorPosition() {
    if (this.vrmode) {
      if (this.cursorvisible) {
        this.cursorvisible = false;
      }
      return;
    }

    const cursor: any = (this.el.sceneEl as Entity).querySelector('[cursor]');
    const visible =
      cursor.components.raycaster.intersectedEls[0]?.hasAttribute(
        'teleportable',
      );

    if (visible) {
      const { point } = cursor.components.raycaster.rawIntersections[0];

      this.el.object3D.position.set(point.x, point.y + 0.001, point.z);

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

    cursor?.addEventListener('click', this.teleport);
    cursor?.addEventListener('mousedown', this.saveMouseDownPosition);
    document.addEventListener('mousemove', this.saveMousePosition);
    document.addEventListener('touchstart', this.saveTouchPosition);
    document.addEventListener('touchmove', this.saveTouchPosition);
  }

  override tick(): void {
    this.computeCursorPosition();
  }

  override remove(): void {
    const cursor = this.el.sceneEl?.querySelector('[cursor]');

    cursor?.removeEventListener('click', this.teleport);
    cursor?.removeEventListener('mousedown', this.saveMouseDownPosition);
    document.removeEventListener('mousemove', this.saveMousePosition);
    document.removeEventListener('touchstart', this.saveTouchPosition);
    document.removeEventListener('touchmove', this.saveTouchPosition);
  }

  override render() {
    return html`
      ${!this.cursorvisible
        ? nothing
        : html`
            <a-ring
              color=${this.color}
              radius-outer="0.2"
              radius-inner="0.15"
              rotation="-90 0 0"
            ></a-ring>
          `}
    `;
  }
}
