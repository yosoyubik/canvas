# *Canvas* for \~Urbit

[![awesome urbit badge](https://img.shields.io/badge/~-awesome%20urbit-lightgrey)](https://github.com/urbit/awesome-urbit)

[![Header](/images/canvas.png)](https://www.youtube.com/watch?v=S6DySv730Hw)

[Video Demo](https://yosoyubik.fra1.digitaloceanspaces.com/norsyr-torryn/2021.7.06..15.37.33-Jul-06-2021%2017-36-28.mp4)

## Features

- Each stroke is stored automatically on your Urbit.
- Export Canvas Images as SVG.
  - Image files are stored on S3 Storage, if configured.
- Allows creation of Public/Private Canvas.
  - Others can join a Public Canvas and work collaboratively in a cool art project.

## Access

A public canvas is hosted at

```hoon
~master-norsyr-torryn/canvas
```

Come and join the first collaborative Urbit Canvas!

## Installation

Copy and commit the contents of the urbit folder to your pier.

- First you need to mount the desk from where you will run canvas (e.g. by running `> |mount /=home=` from your urbit
- You copy all the frontend and backend files using the `install.sh` script: `install.sh <PATH_TO_THE_MOUNTED_DESK>`

## Running

```dojo
> |start %canvas
> |start %canvas-view
```

Then navigate to `YOUR_URBIT_URL/~canvas` (if you are running locally, this is usually: `http://localhost:8080/~canvas`)

## Templates

TODO
