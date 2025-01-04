# Element creation

> **_ Libraries concerned _**  
> [@digipair-xr/core](https://www.npmjs.com/package/@digipair-xr/core)  
> [@digipair-xr/observe](https://www.npmjs.com/package/@digipair-xr/observe)

## Pin's

On [digipair-xr](https://opensource.digipair.ai), a library who exposes an autonomous 3d webcomponents is named a pin's.  
In this section, we will create your first pin's !

### Generate a new Pin's

To generate a Pin's, we will use a nx generator embedded in the [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) project.

On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn nx workspace-generator pins {pins-name} {pins-domain}
```

> `pins-name` is the name of your webcomponent
> `pins-domain`is a directory who group several pin's

This command generate a new directory in `libs/{pins-domain}/{pins-name}`.  
The pin's source code is available in the file `libs/{pins-domain}/{pins-name}/src/lib/{pins-name}.element.ts

**example for a pins `hello-world` in the domain `example`**

```bash
yarn nx workspace-generator pins hello-world example
```

<iframe src="https://codesandbox.io/embed/github/pinser-metaverse/pinser-metaverse-examples/tree/element-creation-generate-pins/?fontsize=10&hidenavigation=1&theme=dark&view=split&module=/libs/example/hello-world/src/lib/hello-world.element.ts"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Pinser element-creation Pin's generation"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### Display a Pin's

A generated Pin's can be served to develop it without the full context of your metaverse.

On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn nx serve {pins-domain}-{pins-name}
```

> a new port is opened to see the preview on your browser. The default port is `3000` if it is available.

## Element

[digipair-xr](https://opensource.digipair.ai) element is a 3D web component.  
By convention, it is generally creatted in a typescript file ended by `.element.ts`.

### @customElement decorator

To keep the compatibility with [AFrame](https://aframe.io), [digipair-xr](https://opensource.digipair.ai) use a similar interface that [lit](https://lit.dev) to manage the properties, but don't use [lit](https://lit.dev). So, there are some little differencies with the behavior and the interface.
To create a [digipair-xr](https://opensource.digipair.ai) element, you can use the decorator `@customElement`.

```typescript
@customElement(element: string, options: {
  providers: DXRProvider[],
  networked: boolean
})
```

- providers: provider list to provide from this element (see [#provider](#provider) section for more information)
- networked: share on the network all data saved in a variable prefixed by the decorator [@state](#@state)

Example:

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-hello-world')
export class HelloWorldElement extends DXRElement {
  override render(): TemplateResult {
    return html`<a-box></a-box>`;
  }
}
```

### Display variable

[digipair-xr](https://opensource.digipair.ai) use [lit-html](https://lit.dev) to menage the template. Your can read more information on [lit documentation](https://lit.dev/docs/templates/overview/).

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-hello-world')
export class HelloWorldElement extends DXRElement {
  override render(): TemplateResult {
    const text = 'Hello world !';
    return html`<a-entity text="value: ${text};"></a-entity>`;
  }
}
```

### Manage events

[digipair-xr](https://opensource.digipair.ai) use [lit-html](https://lit.dev) to menage the template. Your can read more information on [lit documentation](https://lit.dev/docs/templates/overview/).

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-selectable-box')
export class HelloWorldElement extends DXRElement {
  override render(): TemplateResult {
    return html`<a-box selectable @click=${() => console.log('box clicked')}> </a-box>`;
  }
}
```

> `selectable`attribute is required to catch the mouse/touch/lazer events (`click`, `mouseenter`, `mouseleave`, ...)  
> See [AFrame documentation](https://aframe.io/docs/) for more information about events

### AFrame hook

All the hooks [AFrame](https://aframe.io/docs/1.4.0/core/component.html#overview-of-methods) are usable with [digipair-xr](https://opensource.digipair.ai).

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-hello-world')
export class HelloWorldElement extends DXRElement {
  override init(): void {
    console.log('example-hello-world element is initialized');
  }

  override render(): TemplateResult {
    return html`<a-box></a-box>`;
  }
}
```

### @property decorator

To keep the compatibility with [AFrame](https://aframe.io), [digipair-xr](https://opensource.digipair.ai) use a similar interface that [lit](https://lit.dev) to manage the properties, but don't use [lit](https://lit.dev). So, there are some little differencies with the behavior and the interface.
To read an attribute from the HTML element, you can use the decorator `@property`.

```typescript
@property(options: {
  default: any
})
```

- default: value setted to the variable when no HTML attribute is given

Example:

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-hello-world')
export class HelloWorldElement extends DXRElement {
  @property()
  text: string;

  override render(): TemplateResult {
    return html`<a-entity text="value: ${this.text};"></a-entity>`;
  }
}
```

```html
<dxr-scene>
  <template slot="scene">
    <example-hello-world text="Hello World"></example-hello-world>
  </template>
</dxr-scene>
```

### @state decorator

To keep the compatibility with [AFrame](https://aframe.io), [digipair-xr](https://opensource.digipair.ai) use a similar interface that [lit](https://lit.dev) to manage the properties, but don't use [lit](https://lit.dev). So, there are some little differencies with the behavior and the interface.
To rendering the component each time a variable is updated, you can use the decorator `@state`.  
The value is synchronized on the networked if the networked attribute of the `customElement` decorator set to true.

```typescript
@state()
```

Example:

```typescript
import { customElement, html, DXRElement, TemplateResult } from '@digipair-xr/core';

@customElement('example-color-box')
export class HelloWorldElement extends DXRElement {
  @state()
  color = 'green';

  override render(): TemplateResult {
    return html`<a-box color=${this.color} selectable @click=${() => (this.color === 'green' ? (this.color = 'red') : (this.color = 'green'))}></a-box>`;
  }
}
```

### @inject decorator

To share data and behavior between components and providers, you can use a provider.  
The decorator `@inject` load a provider instance provided in a component from the attribute `provider`.

```typescript
@inject()
```

Example:

```typescript
@customElement('game-tictactoe-pawn')
export class TictactoePawnElement extends DXRElement {
  @inject()
  private tictactoeProvider!: TictactoeProvider;

  // ...
}
```

## Provider

A provider is useful to share data and behavior between more than one components or other providers.  
It can be injected in an other provider or an element with the decorator [@inject](#@inject).  
It must be provided in a parent element to be found by the decorator [@inject](#@inject).

### @instanciable decorator

```typescript
@instancialble(options: {
  networked: boolean
})
```

- networked: share variables prefixed with the decorator on the networked `@state` (default: false)

Example:

```typescript
@injectable()
export class TictactoeProvider extends DXRProvider {
  // ...
}
```

### @state decorator

see the section [@state decorator](#state-decorator) of the component section because the interface is the same.

> Don't hesitate to improve this documentation, any help will be amazing !  
> [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/digipair/digipair-xr/blob/master/docs/element-creation.md)
