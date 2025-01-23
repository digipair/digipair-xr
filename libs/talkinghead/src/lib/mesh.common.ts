import { DXRElement, Entity, THREE } from '@digipair-xr/core';

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

function kebabCase(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export abstract class MeshCommon extends DXRElement {
  abstract object: string;
  abstract shared: boolean;

  
}
