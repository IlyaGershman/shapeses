import { EntityManager } from "./ecs/entity-manager";
import { Entity } from "./ecs/entity";
import { ThreejsController } from "./ThreejsController";
import { LevelController } from "./LevelController";
import { PlayerController } from "./PlayerController";
import { DnDController } from "./DnDController";
import { BackgroundController } from "./BackgroundController";

class ShapesGame {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this.entityManager_ = new EntityManager();

    this.LoadControllers_();

    this.previousRAF_ = null;
    this.RAF_();
  }

  LoadControllers_() {
    const threejs = new Entity();
    threejs.AddComponent(new ThreejsController());
    this.entityManager_.Add(threejs, "renderer");

    // Hack
    this.renderer_ = threejs.GetComponent("ThreejsController");
    this.scene_ = threejs.GetComponent("ThreejsController").scene_;
    this.camera_ = threejs.GetComponent("ThreejsController").camera_;
    this.threejs_ = threejs.GetComponent("ThreejsController").threejs_;

    const level = new Entity();
    level.AddComponent(new DnDController());
    level.AddComponent(new LevelController());
    this.level_ = level.GetComponent("LevelController");
    this.entityManager_.Add(level, "level");

    const world = new Entity();
    world.AddComponent(new BackgroundController({ scene: this.scene_ }));
    this.background_ = world.GetComponent("BackgroundController");
    this.entityManager_.Add(world, "world");

    // Uncomment for testing
    const player = new Entity();
    player.AddComponent(new PlayerController());
    this.entityManager_.Add(player, "player");

    this.renderer_.AttachCameraHelper();
    this.renderer_.AttachAxesHelper();
  }

  RAF_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.Step_(t - this.previousRAF_);
      this.renderer_.Render();
      this.previousRAF_ = t;

      setTimeout(() => {
        this.RAF_();
      }, 1);
    });
  }

  Step_(timeElapsed) {
    const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);

    this.entityManager_.Update(timeElapsedS);
  }
}

window._APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new ShapesGame();
});
