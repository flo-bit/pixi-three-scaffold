# PIXI+THREE scaffold

This is a scaffold for PIXI.js + THREE.js projects (combining 3d and 2d rendering).

includes:

- import of PIXI.js and THREE.js
- adds an offscreen canvas for THREE.js and a PIXI.js texture of the canvas
- automatic resizing of root container (fixed size) and canvas to window size
- keydown and keyup events
- setup and update functions

see [flo-bit.github.io/pixi-three-scaffold/](https://flo-bit.github.io/pixi-three-scaffold/) for a simple example.

## Usage

- import the `pixi-scaffold` module

```js
import PixiScaffold from "https://flo-bit.github.io/pixi-scaffold/pixi-scaffold.js";
```

- make a game class with a `setup` and `update` function

```js
class Game {
  setup(app) {
    // setup your game here
  }
  update(delta, total, app) {
    // update your game here
  }
}
```

- create a new instance of `PixiScaffold` and pass an instance of the game class

```js
const game = new Game();
const app = new PixiScaffold(game);
```
