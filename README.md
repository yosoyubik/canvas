# *Canvas* for \~Urbit

[![Header](/images/canvas.png)](https://www.youtube.com/watch?v=S6DySv730Hw)

[Video Demo](https://www.youtube.com/watch?v=S6DySv730Hw)

## Features

- Each stroke is stored automatically on your Urbit.
- Export Canvas Images as SVG/PNG files.
  - Allows for selective removal of the Color Palette and/or Hexagonal Mesh.
  - Image files are stored on your Urbit and served through %eyre.
  - Option to share a canvas file in a chat room.
- Allows creation of Public/Private Canvas.
  - A shared canvas becomes local once the subscription is pulled.
  - Others can join a Public Canvas and work collaboratively in a cool art project.

## Dependencies

[NodeJS](https://nodejs.org/en/) needs to be installed to package and copy the app to the mounted urbit folder:

  Linux:
  ```
  sudo apt install nodejs
  ```
  Mac:
  ```
  :: Homebrew can be installed running:
  :: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  ::
  brew install node
  ```

A specific version of node can be installed with the following commands:  
```  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
nvm install 12.0.0
nvm use 12.0.0
```

Finally, to install all the dependencies run `npm install`

## Installation

In order to run your canvas app on your ship, before `|install` is implemented natively on urbit, you will need to mount your pier to Unix with `|mount %`.

Then you need to add the path to you urbit's pier in .urbitrc. The file is not provided by this repo so you need to create it manually:

```
module.exports = {
  URBIT_PIERS: [
    "PATH/TO/YOUR/PIER",
  ]
};
```

You have two options to mount the canvas into your pier:

- ##### `npm run build`

This builds your application and copies it into your Urbit ship's desk. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

- ##### `npm run serve`

Builds the application and copies it into your Urbit ship's desk, watching for changes. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

When you make changes, the `urbit` directory will update with the compiled application and, if you're running `npm run serve`, it will automatically copy itself to your Urbit ship when you save your.

## Running

To start the canvas agent run this commands from `%dojo`:
```
> |start %canvas
>=
> |start %canvas-view
>=
```

If the tile doesn't load on the Home page screen run this command:

```
> :launch &launch-action [%add %canvas /canvastile '/~canvas/js/tile.js']
```
<img src="/images/tile.png" width="180">

You'll get an error (more info [here](https://github.com/yosoyubik/canvas/issues/2#issuecomment-631248364)) but the tile will show up on the home screen.

Direct link: `<YOUR_URL>/~canvas`

## Templates

<img src="/images/templates.png" width="500">



- Hexagonal Mesh (See [Gallery](./GALLERY.md) for a preview of the available Mesh templates.)
- World Maps: US, Europe, Africa (more soon...)
- Freehand Canvas.

#### Mesh
![Mesh](/images/mesh.png)
#### Europe
![Europe](/images/europe.png)
#### Africa
![Africa](/images/exported-africa.svg)
#### US
![US](/images/export.png)
#### FreeHand
![Free](/images/freehand.png)
#### Share on Chat (I)
![Chat](/images/share-chat.png)
#### Share on Chat (II)
![Chat](/images/chat.png)
