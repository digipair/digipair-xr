/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Entity, Schema, System } from 'aframe';
import { render, TemplateResult } from 'lit';
import { subscription } from '../interfaces/subscription';

export class DXRElement {
  static __NETWORKED__: boolean;
  static __ELEMENT_NAME__: string;
  static __INTERNAL_PROPERTIES__: string[];

  static schema: Schema;
  static dependencies: string[];
  static multiple: boolean;
  static mappings: unknown;

  __AFRAME_INSTANCE__!: Component;
  __SUBSCRIPTIONS__!: subscription[];

  init(): void {}
  pause(): void {}
  play(): void {}
  remove(): void {}
  tick(time: number, timeDelta: number): void {}
  tock(time: number, timeDelta: number, camera: any): void {}
  update(oldData: unknown): void {}
  updateSchema(): void {}

  extendSchema(update: Schema): void {
    this.__AFRAME_INSTANCE__.extendSchema(update);
  }
  flushToDOM(): void {
    this.__AFRAME_INSTANCE__.flushToDOM();
  }

  get attrName(): string | undefined {
    return this.__AFRAME_INSTANCE__.attrName;
  }
  get data(): unknown {
    return this.__AFRAME_INSTANCE__.data;
  }
  get dependencies(): string[] | undefined {
    return this.__AFRAME_INSTANCE__.dependencies;
  }
  get el(): Entity {
    return this.__AFRAME_INSTANCE__.el;
  }
  get id(): string {
    return this.__AFRAME_INSTANCE__.id;
  }
  get initialized(): boolean {
    return this.__AFRAME_INSTANCE__.initialized;
  }
  get multiple(): boolean | undefined {
    return this.__AFRAME_INSTANCE__.multiple;
  }
  get name(): string {
    return this.__AFRAME_INSTANCE__.name;
  }
  get system(): System | undefined {
    return this.__AFRAME_INSTANCE__.system;
  }
  get events(): unknown {
    return this.__AFRAME_INSTANCE__.events;
  }

  requestUpdate(): void {
    if (!this.el) return;

    const template = this.render();
    if (template) {
      render(template, this.el);
    }
  }

  render(): TemplateResult | null {
    return null;
  }
}
