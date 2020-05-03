# A Canvas App for Urbit

![Header](/images/canvas.png)


## Features

- Available templates:
  - Hexagonal Mesh.
  - World Maps: US, Europe, Africa (more soon...)
  - Freehand Canvas.
- Live saving: Each stroke is stored remotely on your Urbit so you don't lose anything.
- Export Canvas Images as SVG/PNG files.
  - Allows for selective removal of the Color Palette and/or Hexagonal Mesh.
- Exported files can be shared and previewed in a chat.
- Public/Private Canvas.
- Others can join a Public Canvas and collaborate in a cool art project.

## Installation

In order to run your application on your ship, you will need Urbit v.0.8.0 or higher. On your Urbit ship, if you haven't already, mount your pier to Unix with `|mount %`.

Then you need to add the path to you urbit's pier in .urbitrc. The file is not provided by this repo so you need to create it manually:

```
module.exports = {
  URBIT_PIERS: [
    "PATH/TO/YOUR/PIER",
  ]
};
```

You have two options to mount the game into your pier:

- ##### `npm run build`

This builds your application and copies it into your Urbit ship's desk. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

- ##### `npm run serve`

Builds the application and copies it into your Urbit ship's desk, watching for changes. In your Urbit (v.0.8.0 or higher) `|commit %home` (or `%your-desk-name`) to synchronize your changes.

When you make changes, the `urbit` directory will update with the compiled application and, if you're running `npm run serve`, it will automatically copy itself to your Urbit ship when you save your changes (more information on that below).

## Examples

#### Mesh
![Mesh](/images/export-mesh.png)
#### Europe Map
![Europe](/images/europe.png)
#### Africa
![Africa](/images/exported-africa.png)
#### US
![US](/images/export.png)
#### Chat (I)
![Chat](/images/share-chat.png)
#### Chat (II)
![Chat](/images/chat.png)
