/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  customElement,
  DXRElement,
  html,
  inject,
  nothing,
  TemplateResult,
  THREE,
  unsafeHTML,
} from '@digipair-xr/core';
import 'aframe-blink-controls';
import 'super-hands';
import '../avatar/avatar';
import '../camera/camera';
import '../menu/menu.element';
import '../pins/element';
import { EventTeleport } from '../teleport/event-teleport';
import '../teleport/teleportable-cursor';
import '../toolbar/toolbar';
import '../utils/Geometry.js';
import '../utils/look-controls-custom.js';
import { PlayerProvider } from './player.provider';
import './selectable.directive';

declare const NAF: any;

@customElement('dxr-player')
export class PlayerElement extends DXRElement {
  @inject()
  playerProvider!: PlayerProvider;

  private vrmode!: boolean;
  private templates = [
    {
      id: 'avatar-template',
      content: `<a-entity dxr-avatar networked-audio-source></a-entity>`,
    },
    {
      id: 'player-template',
      content: `<a-entity></a-entity>`,
    },
    {
      id: 'left-hand-template',
      content: `
        <a-entity>
          <a-gltf-model
            class="tracked-left-hand"
            rotation="0 0 90"
            src="https://assets.pinser-metaverse.com/objects/leftHandHigh.glb"
          ></a-gltf-model>
        </a-entity>
      `,
    },
    {
      id: 'right-hand-template',
      content: `
        <a-entity>
          <a-gltf-model
            class="tracked-right-hand"
            rotation="0 0 -90"
            src="https://assets.pinser-metaverse.com/objects/rightHandHigh.glb"
          ></a-gltf-model>
        </a-entity>
      `,
    },
  ];

  private defaultCamera(): TemplateResult {
    return html`
      <dxr-player-camera vrmode=${this.vrmode}></dxr-player-camera>
    `;
  }

  private defaultHandLeft(): TemplateResult {
    return html`
      <a-entity rotation="-90 0 90">
        ${!this.playerProvider.playermenu.visible
          ? nothing
          : html`<dxr-player-menu
              scale="0.55 0.5 1"
              position="-0.5 0.15 0"
              rotation="0 0 0"
            ></dxr-player-menu>`}
        <dxr-player-toolbar
          position="-0.15 0.1 0"
          rotation="0 0 0"
        ></dxr-player-toolbar>
      </a-entity>
    `;
  }

  private defaultHandRight(): typeof nothing {
    return nothing;
  }

  private readonly entervr = () => {
    this.vrmode = true;
    this.requestUpdate();
  };
  private readonly exitvr = () => {
    this.vrmode = false;
    this.requestUpdate();
  };

  private readonly teleport = ({ detail }: CustomEventInit<EventTeleport>) => {
    const { position, rotation } = detail as EventTeleport;

    const player = this.el.querySelector('[player]');
    const camera = this.el.querySelector('[camera]');

    player?.setAttribute('position', position);

    if (camera) {
      camera.setAttribute('position', '0 1.6 0');

      if (rotation) {
        const [rx, ry] = rotation.split(' ');

        (camera as any).components[
          'look-controls-custom'
        ].pitchObject.rotation.x = (THREE as any).MathUtils.degToRad(+rx);
        (camera as any).components[
          'look-controls-custom'
        ].yawObject.rotation.y = (THREE as any).MathUtils.degToRad(+ry);
      }
    }
  };

  override init(): void {
    this.vrmode = false;

    this.el.sceneEl?.addEventListener('enter-vr', this.entervr);
    this.el.sceneEl?.addEventListener('exit-vr', this.exitvr);
    this.playerProvider.el.addEventListener('teleport', this.teleport);

    this.initTemplates();
  }

  private initTemplates(): void {
    let assets = this.el.sceneEl?.querySelector(':scope > a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      this.el.sceneEl?.appendChild(assets);
    }

    this.templates.forEach(({ id, content }) => {
      const template = document.createElement('template');
      template.setAttribute('id', id);
      template.innerHTML = content;
      assets?.appendChild(template);
    });

    NAF?.schemas.add({
      template: `#avatar-template`,
      components: [
        'position',
        'rotation',
        'dxr-avatar',
        'networked-audio-source',
      ],
    });
  }

  override remove(): void {
    this.el.sceneEl?.removeEventListener('enter-vr', this.entervr);
    this.el.sceneEl?.removeEventListener('exit-vr', this.exitvr);
    this.playerProvider.el.removeEventListener('teleport', this.teleport);
  }

  override render(): TemplateResult {
    const templateCamera = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=camera]')?.innerHTML;
    const templateHandLeft = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=handleft]')?.innerHTML;
    const templateHandRight = this.el
      .closest(`dxr-scene`)
      .querySelector(':scope > template[slot=handright]')?.innerHTML;

    return html`
      ${this.playerProvider.customcursor
        ? unsafeHTML(
            `<${this.playerProvider.customcursor} vrmode=${this.vrmode}></${this.playerProvider.customcursor}>`,
          )
        : html`<dxr-teleportable-cursor
            vrmode=${this.vrmode}
          ></dxr-teleportable-cursor>`}
      ${this.vrmode || !this.playerProvider.playermenu.visible
        ? nothing
        : html`<a-entity
            position=${this.playerProvider.playermenu.position}
            rotation=${this.playerProvider.playermenu.rotation}
          >
            <dxr-player-menu position="-0.56 -0.27 -0.99"></dxr-player-menu>
          </a-entity>`}

      <a-entity player networked="template: #player-template;">
        <a-entity
          position="0 1.6 0"
          camera="fov: 40; zoom: 1;"
          look-controls-custom="reverseMouseDrag: true; touchEnabled: true; magicWindowTrackingEnabled: false;"
          ?wasd-controls=${this.playerProvider.debug}
          networked="template: #avatar-template;"
        >
          <a-entity
            raycaster="objects: [selectable];"
            cursor="rayOrigin: mouse; fuse: false;"
          ></a-entity>
          ${!templateCamera ? this.defaultCamera() : unsafeHTML(templateCamera)}
        </a-entity>

        ${!this.vrmode
          ? nothing
          : html`
              <a-entity
                super-hands=" colliderEvent: collisions;
                              colliderEventProperty: els;
                              colliderEndEvent: collisions;
                              colliderEndEventProperty: clearedEls;
                              grabStartButtons: triggerdown;
                              grabEndButtons: triggerup;
                              stretchStartButtons: triggerdown;
                              stretchButtonButtons: triggerup;
                              dragDropStartButtons: triggerdown;
                              dragDropEndButtons: triggerup;"
                physics-collider
                static-body="shape: sphere; sphereRadius: 0.02;"
                collision-filter="group: hand;"
                hand-controls="hand: left;"
                laser-controls="hand: left;"
                blink-controls="cameraRig: [player]; teleportOrigin: [camera]; collisionEntities: [teleportable]; snapTurn: false;"
                raycaster="objects: [selectable];"
                networked="template: #left-hand-template; attachTemplateToLocal: false;"
              >
                ${!templateHandLeft
                  ? this.defaultHandLeft()
                  : unsafeHTML(templateHandLeft)}
              </a-entity>
              <a-entity
                super-hands=" colliderEvent: collisions;
                              colliderEventProperty: els;
                              colliderEndEvent: collisions;
                              colliderEndEventProperty: clearedEls;
                              grabStartButtons: triggerdown;
                              grabEndButtons: triggerup;
                              stretchStartButtons: triggerdown;
                              stretchButtonButtons: triggerup;
                              dragDropStartButtons: triggerdown;
                              dragDropEndButtons: triggerup;"
                physics-collider
                static-body="shape: sphere; sphereRadius: 0.02;"
                collision-filter="group: hand;"
                hand-controls="hand: right;"
                laser-controls="hand: right;"
                blink-controls="cameraRig: [player]; teleportOrigin: [camera]; collisionEntities: [teleportable]; snapTurn: false;"
                raycaster="objects: [selectable];"
                networked="template: #right-hand-template; attachTemplateToLocal: false;"
              >
                ${!templateHandRight
                  ? this.defaultHandRight()
                  : unsafeHTML(templateHandRight)}
              </a-entity>
            `}

        <a-entity hand-tracking-controls="hand: left;"> </a-entity>
        <a-entity hand-tracking-controls="hand: right;"></a-entity>
      </a-entity>
    `;
  }
}
