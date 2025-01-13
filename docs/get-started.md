# Get started

The easier way to create your own project is to fork the project [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap).

There is 2 options:

- [Quick](#quick)
- [Normal](#Normal)

## Quick

The project [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) is ready to be used with the wonderful tool CodeSandbox.

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/pinser-metaverse/metaverse-boostrap/blob/master/apps/metaverse/src/lib/metaverse.space.ts)

## Normal

The project [metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) is hosted on Github and use the repository engine Git.

### Requirements

The project requires the following tools:

- NodeJS LTS (https://nodejs.org)
- Git (https://git-scm.com)
- Yarn (https://classic.yarnpkg.com/lang/en/docs/install/)

### Clone the project

On a bash / DOS terminal, execute the following command:

```bash
git clone https://github.com/pinser-metaverse/metaverse-boostrap.git
```

### Install dependencies

On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn install
```

### Start the development server

[metaverse-bootstrap](https://github.com/pinser-metaverse/metaverse-boostrap) use the build system [nx](https://nx.dev) to be more flexible.
The project is composed of one application named "metaverse".

On a bash / DOS terminal, execute the following command **in your project directory**:

```bash
yarn nx serve metaverse
```

### See the result

Open http://localhost:3000/ in your browser to see the result

## Add a network session

To see the other connected users, you must create a network session:

1. open the file `apps/metaverse/src/metaverse.html`
2. add an attribute `session` to the html element `dxr-scene` with a unique uuid as value

> The uuid can be generated from [uuidgenerator.net](https://www.uuidgenerator.net) for example

<iframe src="https://codesandbox.io/embed/github/pinser-metaverse/pinser-metaverse-examples/tree/get-started-network/?fontsize=10&hidenavigation=1&theme=dark&view=editor&module=/apps/metaverse/src/metaverse.html&codemirror=1&highlights=50"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Pinser get-started network"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

> Congratulation, you created your first web metaverse with [digipair-xr](https://opensource.digipair.ai).  
> You can test it on Phone, tablet, Desktop and VR/AR/XR headset

## Next step

Create your first Pin's [a tic-tac-toe](example-tictactoe)

> Don't hesitate to improve this documentation, any help will be amazing !  
> [![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/digipair/digipair-xr/blob/master/docs/get-started.md)
