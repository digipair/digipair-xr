import { DXRElement, html, inject } from '@digipair-xr/core';
import { routeElement } from '@digipair-xr/router';
import { SessionProvider } from '../../../../session.provider';

@routeElement('experiences-cinema-space')
export class CinemaSpaceElement extends DXRElement {
  @inject()
  sessionProvider: SessionProvider;

  override init() {
    let assets = this.el.sceneEl?.querySelector(':scope > a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      this.el.sceneEl?.appendChild(assets);
    }

    let video = assets.querySelector('#video') as any;
    if (!video) {
      video = document.createElement('video');
      video.setAttribute('id', 'video');
      video.setAttribute('loop', 'true');

      const source = document.createElement('source');
      source.setAttribute(
        'src',
        'https://agency-experiences.onrender.com/assets/spaces/experiences/timeScapes.mp4',
      );

      video.appendChild(source);
      assets.appendChild(video);
    }

    video.play();

    this.sessionProvider.startSession('0072b0f5-8a76-4b83-9b17-57ad4dca04c6');
  }

  override remove() {
    const assets = this.el.sceneEl?.querySelector(':scope > a-assets') as any;
    const video = assets.querySelector('#video') as any;
    video.pause();

    this.sessionProvider.stopSession();
  }

  override render() {
    return html`
      <a-sky
        hide-on-ar
        material="shader: gradient; topColor: 255 255 255; bottomColor: 0 10 255;"
      ></a-sky>

      <a-video
        position="1.6 1.5 -0.4"
        rotation="0 -45 0"
        src="#video"
        width="3.2"
        height="1.8"
      ></a-video>
    `;
  }
}
