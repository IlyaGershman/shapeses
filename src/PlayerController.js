import { Component } from "./ecs/entity";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class PlayerController extends Component {
  constructor() {
    super();
  }

  InitEntity() {
    this.RegisterGlobalHandler("dragging.started", this.StopMoving.bind(this));
    this.RegisterGlobalHandler(
      "dragging.finished",
      this.ResumeMoving.bind(this)
    );

    const threejsController =
      this.FindEntity("renderer").GetComponent("ThreejsController");

    this.controls = new OrbitControls(
      threejsController.camera_,
      threejsController.threejs_.domElement
    );
    console.log(this.controls);
  }

  OnResize_() {}

  StopMoving() {
    console.log("stop moving");
    this.controls.enableRotate = false;
  }

  ResumeMoving() {
    console.log("resume moving");
    this.controls.enableRotate = true;
  }

  Update(timeElapsed) {
    this.controls.update(timeElapsed);
  }

  Render() {}
}
