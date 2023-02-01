import * as PIXI from "https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.min.mjs";
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";

export default class PixiScaffold {
  constructor(opts) {
    this.opts = opts ?? {};
    window.PIXI = PIXI;
    this.opts.PS = this;
    window.PS = this;
    this.app = new PIXI.Application();
    this.app.view.style.position = "absolute";
    this.app.view.style.top = "0px";
    this.app.view.style.left = "0px";
    document.body.appendChild(this.app.view);

    this.w = this.w ?? 1000;
    this.h = this.h ?? 1000;
    this.root = new PIXI.Container();
    this.root.sortableChildren = true;
    this.app.stage.addChild(this.root);
    this.windowResized();

    this.keys = {};
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("resize", this.windowResized.bind(this));

    this.setupThree();

    if (this.opts.setup) this.opts.setup(this);
    let ticker = PIXI.Ticker.shared;
    ticker.add(this.animate.bind(this));
  }
  setupThree() {
    window.THREE = THREE;

    let renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0, 0.0);
    renderer.setSize(this.w, this.h);

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      this.opts.fov ?? 75,
      this.w / this.h,
      this.opts.zNear ?? 0.1,
      this.opts.zFar ?? 1000
    );

    // Lights
    if (this.opts.defaultLights || true) {
      let light = new THREE.AmbientLight(0x404040); // Soft white light
      scene.add(light);

      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0.9, 0.7, 1);
      scene.add(directionalLight);
    }

    this.three = {};
    this.three.renderer = renderer;
    this.three.scene = scene;
    this.three.camera = camera;
    let baseTexture = PIXI.BaseTexture.from(renderer.domElement, {
      scaleMode: PIXI.SCALE_MODES.LINEAR,
    });
    let texture = new PIXI.Texture(baseTexture);
    let sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.zIndex = 0;
    //sprite.scale.set(window.devicePixelRatio);
    this.root.addChild(sprite);
    this.three.offscreen = true;
    this.three.texture = baseTexture;
    this.three.sprite = sprite;
    this.three.renderer.render(scene, camera);
    this.three.addChild = (c) => {
      scene.add(c);
    };
    this.three.add = (c) => {
      scene.add(c);
    };

    window.TS = this.three;
    this.opts.TS = this.three;
  }

  animate() {
    /* Update your scene here */
    let elapsed = PIXI.Ticker.shared.elapsedMS / 1000.0;
    let total = PIXI.Ticker.shared.lastTime / 1000.0;

    if (this.three) {
      this.three.renderer.render(this.three.scene, this.three.camera);
      this.three.texture.update();
    }
    if (this.opts.update) this.opts.update(elapsed, total, this);
  }
  resizeRoot() {
    let w = window.innerWidth,
      h = window.innerHeight;
    let scl = Math.min(w / this.w, h / this.h);
    this.root.position.x = w / 2;
    this.root.position.y = h / 2;
    this.root.scale.x = scl;
    this.root.scale.y = scl;
  }
  windowResized() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.resizeRoot();
  }
  keyDown(event) {
    this.keys[event.key] = true;
  }
  keyUp(event) {
    this.keys[event.key] = false;
  }
  addChild(c) {
    this.root.addChild(c);
  }
  add(c) {
    this.addChild(c);
  }
}
