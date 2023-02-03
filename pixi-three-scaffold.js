import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";
import PixiScaffold from "https://flo-bit.github.io/pixi-scaffold/pixi-scaffold.js";

export default class PixiThreeScaffold extends PixiScaffold {
  setup() {
    this.setupThree();
    super.setup();
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
    if (this.three) {
      this.three.renderer.render(this.three.scene, this.three.camera);
      this.three.texture.update();
    }
    super.animate();
  }
}
