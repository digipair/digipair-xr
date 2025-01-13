import { Entity, THREE } from '@digipair-xr/core';

AFRAME.registerComponent('selectable', {
  schema: {
    pressDistance: { default: 0.06 },
  },

  init: function () {
    this.worldPosition = new THREE.Vector3();
    this.handEls = document.querySelectorAll('[hand-tracking-controls]');
    this.pressed = false;
  },

  tick: function () {
    const handEls = this.handEls;
    let handEl: Entity;
    let touch: number;

    for (let i = 0; i < handEls.length; i++) {
      handEl = handEls[i];
      touch = this.calculateFingerDistance(
        (handEl.components['hand-tracking-controls'] as any).indexTipPosition,
      );
      if (touch) {
        // if (!this.pressed) { this.el.emit('pressedstarted'); }
        this.pressed = true;
        return;
      }
    }
    if (this.pressed) {
      this.el.emit('click');
    }
    this.pressed = false;
  },

  calculateFingerDistance: function (fingerPosition: any) {
    const el = this.el;
    const worldPosition = this.worldPosition;
    const position =
      el.tagName === 'dxr-MESH'
        ? el.object3D.children[0]?.position
        : el.object3D.position;

    if (!position) {
      return false;
    }

    worldPosition.copy(position);
    el.object3D.parent.updateMatrixWorld();
    el.object3D.parent.localToWorld(worldPosition);

    return worldPosition.distanceTo(fingerPosition) < this.data.pressDistance;
  },
} as any);
