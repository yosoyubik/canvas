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

Search for `~dister-norsyr-torryn` in Grid to find the Canvas app, and install it from there

A public canvas is hosted at

```hoon
~picsel-norsyr-torryn/public
```

Come and join the group to share your creations and see what others are doing:
```hoon
~norsyr-torryn/canvas
```

## Development Setup

1. Clone the repo, of course
2. Create a new desk in Urbit to install canvas in
    - `$ ./urbit -F zod` - Spin up a fake zod, if you haven't already (should be running on port 8080. If not, you'll need to edit [`ui/svelte.config.js`](ui/svelte.config.js))
    - `dojo> +code` - Get an access code and use it to sign in to your ship at http://localhost:8080
    - `dojo> |mount %base` - Mount `%base`, if you haven't already
    - `dojo> |merge %canvas our %base` - Create a `%canvas` desk
    - `dojo> |mount %canvas` - Mount the desk so it appears in your pier
    - `$ rm -r zod/canvas/*` - Clear out your new desk to make room for the actual desk
    - Follow the instructions [here](https://urbit.org/docs/userspace/dist/guide#create-desk) to merge the `base-dev` and `garden-dev` desks into your desk
3. Copy canvas desk to Urbit
    From the repo folder, run `./install.sh <PATH_TO_THE_MOUNTED_DESK>` where `<PATH_TO_THE_MOUNTED_DESK>` might be something like `~/urbit/zod/canvas`
    You can alse run `./install.sh -w <PATH_TO_THE_MOUNTED_DESK>` if you want to watch for changes.
4. Install `%canvas` in Dojo with
    - `dojo> |commit %canvas` (do this after every change to see it reflected in Urbit)
    - `dojo> |install our %canvas`(only necessary the first time, I think)
5. Serve the UI for development
    In the repo folder:
    - `cd ui`
    - `npm i` (short for `npm install`)
    - `npm run dev` (runs on port 3000. To run on a different port: `npm run dev -- --port 3001`)
    - Visit http://localhost:3000/apps/canvas
6. Eventually, build the UI to test in Urbit for real test
    - `npm run build` (in `/ui`)
    - `./install.sh <PATH_TO_THE_MOUNTED_DESK>` (in project root)
    - `|commit %canvas` (in dojo)
## Templates

TODO
