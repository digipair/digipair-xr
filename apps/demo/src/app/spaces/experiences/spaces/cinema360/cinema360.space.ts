import { DXRElement, html, inject } from '@digipair-xr/core';
import { routeElement } from '@digipair-xr/router';
import { SessionProvider } from '../../../../session.provider';

@routeElement('experiences-cinema360-space')
export class Cinema360SpaceElement extends DXRElement {
  @inject()
  sessionProvider: SessionProvider;

  override init() {
    let assets = this.el.sceneEl?.querySelector(':scope > a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      this.el.sceneEl?.appendChild(assets);
    }

    let video = assets.querySelector('#video360') as any;
    if (!video) {
      video = document.createElement('video');
      video.setAttribute('id', 'video360');
      video.setAttribute('loop', 'true');

      const source = document.createElement('source');
      source.setAttribute(
        'src',
        'https://agency-experiences.onrender.com/assets/spaces/experiences/vr360.mp4',
      );

      video.appendChild(source);
      assets.appendChild(video);
    }

    video.play();

    this.sessionProvider.startSession('5f1423a6-4fc5-4d12-84f4-c5f6a7fbc1d1');
  }

  override remove() {
    const assets = this.el.sceneEl?.querySelector(':scope > a-assets') as any;
    const video = assets.querySelector('#video360') as any;
    video.pause();

    this.sessionProvider.stopSession();
  }

  override render() {
    return html` <a-videosphere src="#video360"></a-videosphere> `;
  }
}
