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
> :launch &launch-action [%remove %canvas-view /canvastile]
>=
> :launch &launch-action [%add %canvas-view /canvastile '/~canvas/js/tile.js']
>=
```
<img src="/images/tile.png" width="180">

Direct link: `<YOUR_URL>/~canvas`

## Templates

<img src="/images/templates.png" width="500">

- Hexagonal Mesh.
  - Templates:
    - Bitcoin Logo
    - Urbit Canvas Logo
    - ~friendly~ Martian
    - Urbit Sigil ~\~norsyr-torryn!~
- World Maps: US, Europe, Africa (more soon...)
- Freehand Canvas.

#### Mesh
![Mesh](/images/export-mesh.png)
#### Bitcoin
![Bitcoin](/images/bitcoin.png)
#### Sigil
![Sigil](/images/sigil.png)
#### Martian
![Martian](/images/martian.png)
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
