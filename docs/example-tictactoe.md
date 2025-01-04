# My first Pin's: tic-tac-toe game

> _read and follow the section [Get started](get-started) before start this one_

## Before start

- **option 1:** clone the project [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) from Github
- **option 2:**  
  [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/pinser-metaverse/metaverse-boostrap/blob/master/apps/metaverse/src/lib/metaverse.space.ts)

## Generate new Pin's

On [digipair-xr](https://opensource.digipair.ai), a library who exposes an autonomous 3d webcomponents is named a pin's.  
To generate a Pin's, we will use a nx generator embedded in the [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) project.

To develop our game `tic-tac-toe`, we will create 1 Pin's `tictactoe` composed with:

- 1 main element `tictactoe`
- 1 element `tictactoe-pawn`
- 1 proviedr to manage the behavior and share the game state

Generate a new Pin's named `tictactoe` in the domain `game` (see [Element creation](element-creation) for more information).  
On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn nx workspace-generator pins tictactoe game
```

Execute the development server for your new Pin's to see the result.  
On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn nx serve game-tictactoe
```

> a new port is opened to see the preview on your browser. The default port is `3000` if it is available.

## Add provider to manage behavior

A provider is useful to share data and behavior between more than one components or other providers.  
To add a provider in your new Pin's, create a new file `tictactoe.provider.ts` in the directory `libs/game/tictactoe/src/lib/`.

Place the foillowing code in this file:

```typescript
import { injectable, DXRProvider, state } from '@digipair-xr/core';

@injectable()
export class TictactoeProvider extends DXRProvider {
  @state()
  player = 'X';

  @state()
  pawns = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  public async add(line: number, column: number) {
    const pawns = this.pawns;
    const player = this.player;

    if (pawns[line][column] !== '') {
      return;
    }
    pawns[line][column] = player;
    this.player = player === 'X' ? 'O' : 'X';
    this.pawns = pawns;
  }

  public reset() {
    this.pawns = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }
}
```

- Decorator `@injactable` and class `DXRProvider` required to be injectable
- Decorator `state` used to execute a new render in all components who use it
- Variable `player` used to save the next player to play
- Variable `pawns` used to save the game state
- Function `add` used to play a new step
- Function `reset` used to start a new game

## Add pawn element

Pawn element manages the game action to add a new step.  
Tictactoe game is composed with 9 pawns.

Create a new file `tictactoe-pawn.element.ts` in the directory `libs/game/tictactoe/src/lib/`.

Place the foillowing code in your file:

```typescript
import { customElement, html, inject, DXRElement, property, state, TemplateResult } from '@digipair-xr/core';
import { TictactoeProvider } from './tictactoe.provider';

@customElement('game-tictactoe-pawn')
export class TictactoePawnElement extends DXRElement {
  @inject()
  private tictactoeProvider!: TictactoeProvider;

  @property()
  positionline!: number;

  @property()
  positioncolumn!: number;

  @state()
  backgroundcolor = 'grey';

  private add(line: number, column: number) {
    this.tictactoeProvider.add(line, column);
  }

  override render(): TemplateResult {
    const pawns = this.tictactoeProvider.pawns;
    const player = pawns[this.positionline][this.positioncolumn];

    return html`
      <a-box selectable width="0.1" height="0.1" depth="0.01" material="color: ${this.backgroundcolor}" @click=${() => this.add(this.positionline, this.positioncolumn)} @mouseenter=${() => (this.backgroundcolor = '#AAAAAA')} @mouseleave=${() => (this.backgroundcolor = 'grey')}></a-box>
      <a-text value="${player}" width="1.5" position="-0.029 0 0.01"></a-text>
    `;
  }
}
```

- Variable `tictactoeProvider` used to get shared `TictactoeProvider`
- Property `positionline` used to get pawn line from html element attribute
- Property `positioncolumn` used to get pawn column from html element attribute
- Variable `backgroundcolor` used to change pawn color when user is on it
- Function `add` used to play a new game step
- `selectable` is used to listen the events `click`, `mouseenter` and `mouseleave`

`a-box` and `a-text` are [AFrame](https://aframe.io) primitives. All [AFrame](https://aframe.io) primitives are usable in a [digipair-xr](https://opensource.digipair.ai) project.  
[Go here](https://aframe.io/docs/) to find the full primitive list.

## Update Tictactoe element

Update `tictactoe` element to display pawns and a button `reset`

Replace file `libs/game/tictactoe/src/lib/tictactoe.element.ts` content by:

```typescript
import { customElement, html, inject, DXRElement, TemplateResult } from '@digipair-xr/core';
import { TictactoeProvider } from './tictactoe.provider';
import './tictactoe-pawn.element';

@customElement('game-tictactoe', {
  providers: [TictactoeProvider],
})
export class TictactoeElement extends DXRElement {
  @inject()
  private tictactoeProvider!: TictactoeProvider;

  private reset() {
    this.tictactoeProvider.reset();
  }

  override render(): TemplateResult {
    return html`
      <game-tictactoe-pawn positionline="0" positioncolumn="0" position="-0.11 0.28 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="0" positioncolumn="1" position="0 0.28 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="0" positioncolumn="2" position="0.11 0.28 0"></game-tictactoe-pawn>
      <!-- line 2 -->
      <game-tictactoe-pawn positionline="1" positioncolumn="0" position="-0.11 0.17 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="1" positioncolumn="1" position="0 0.17 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="1" positioncolumn="2" position="0.11 0.17 0"></game-tictactoe-pawn>
      <!-- line 3 -->
      <game-tictactoe-pawn positionline="2" positioncolumn="0" position="-0.11 0.06 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="2" positioncolumn="1" position="0 0.06 0"></game-tictactoe-pawn>
      <game-tictactoe-pawn positionline="2" positioncolumn="2" position="0.11 0.06 0"></game-tictactoe-pawn>

      <a-sphere selectable @click=${() => this.reset()} position="0.25 0.05 0" radius="0.05"></a-sphere>
    `;
  }
}
```

Attribute `providers` is used with decorator `@customeElement` to create a new instance for each instance of `game-tictactoe` element.
If 3 `game-tictactoe`are placed in a scene, 3 `TicTacToeProvider` instances are created.

## Use tictactoe pin's in the metaverse

Now, your pin's `game-tictactoe` is ready to be used. Next step is to place the pin's in the metaverse.

Replace `apps/metaverse/src/lib/metaverse.space.ts` content with:

```typescript
import { customElement, html, inject, DXRElement } from '@digipair-xr/core';
import { PlayerProvider } from '@digipair-xr/player';
import '@digipair-xr/teleport';
import '@metaverse-bootstrap/game/tictactoe';

@customElement('metaverse-bootstrap-space')
export class MetaverseBootstrapSpaceElement extends DXRElement {
  @inject()
  playerProvider: PlayerProvider;

  override init(): void {
    this.playerProvider.setInfo({
      username: localStorage.getItem('username') || 'Visiteur',
      avatar: localStorage.getItem('avatar') || '/assets/visitor.glb',
      preview: localStorage.getItem('preview') || '/assets/visitor.png',
    });
  }

  override render() {
    return html` <!-- space -->
      <a-sky hide-on-enter-ar color="#80d4ff"></a-sky>

      <!-- Game panel -->
      <game-tictactoe position="0 1.4 -1"></game-tictactoe>
      <dxr-teleport position="0 0.001 0"></dxr-teleport>

      <!-- ground -->
      <dxr-teleportable hide-on-enter-ar width="22.9" height="16.92" color="#d99f20"></dxr-teleportable>`;
  }
}
```

- `import '@metaverse-bootstrap/game/tictactoe';` add webcomponent `game-tictactoe`

## Add network management

Currently your metaverse is very nice, but you are alone...  
So, you will add network feature to your metaverse to add a collaborative side.

### Add a session

Like seen in the [Get Started](get-started#add-a-network-session) section, to see the other connected users, you must create a network session:

1. open the file `apps/metaverse/src/metaverse.html`
2. add an attribute session to the html element dxr-scene with a unique uuid as value

> The uuid can be generated from [uuidgenerator.net](https://www.uuidgenerator.net/) for example

```html
<dxr-scene session="cc3c1000-c18e-438e-9de4-0200a073cb1e">
  <!-- ... -->
</dxr-scene>
```

### Share the game state

Now, you can see the other users in your metaverse, but you can't play together because the state of your tictactoe is nnot shared on network.  
To share this state, nothing is easier:

1. open the file `libs/game/tictactoe/src/lib/tictactoe.provider.ts`
2. add attribute networked to the decorator `injectable` with the value `true`

```typescript
@injectable({
  networked: true,
})
export class TictactoeProvider extends DXRProvider {
  // ...
}
```

> All data saved in variables prefixed by `@state` are now shared on the network

### Share pawns background

At this step, you can meet and play with the other users of your metaverse. But a detail is missing, you can see when your game friend is hesitating...  
Technically, we must share the pawn background color.

1. open the file `libs/game/tictactoe/src/lib/tictactoe-pawn.element.ts`
2. add attribute networked to the decorator `customElement` with the value `true`

```typescript
@customElement('game-tictactoe-pawn', {
  networked: true,
})
export class TictactoePawnElement extends DXRElement {
  // ...
}
```

> Now the data saved in the variable `backgroundcolor` (prefixed by `@state`) is now shared on the network

## Result

> Consgratulation, your tic-tac-toe is now playable in your metaverse from a simple web page, and compatible with:
>
> - mobile and tablette (3D & AR)
> - Desktop (3D)
> - Headset (3D & AR)

<iframe src="https://codesandbox.io/embed/github/pinser-metaverse/pinser-metaverse-examples/tree/example-tictactoe/?fontsize=10&hidenavigation=1&theme=dark&view=editor&module=/libs/game/tictactoe/src/lib/tictactoe.provider.ts,/libs/game/tictactoe/src/lib/tictactoe.element.ts,/libs/game/tictactoe/src/lib/tictactoe-pawn.element.ts"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Pinser Example Tic-tac-toe"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

> Don't hesitate to improve this documentation, any help will be amazing !  
> [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/digipair/digipair-xr/blob/master/docs/element-creation.md)
