import { Component } from "./ecs/entity";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

export class DnDController extends Component {
  constructor() {
    super();

    this.isDragging = false;
  }

  InitEntity() {
    this.RegisterHandler("level.assembled", (m) => this.AssignDragControls(m));
    this.RegisterHandler("shape.found", (m) => this.onShapeFound(m));
  }

  onShapeFound(msg) {
    this.controls.dispose();
    this.controls = null;
    console.log(msg);
    this.controls = new DragControls(
      msg.value.meches,
      this.threejs.camera_,
      this.threejs.threejs_.domElement
    );
  }
  AssignDragControls(msg) {
    console.log(msg);
    const threejsController =
      this.FindEntity("renderer").GetComponent("ThreejsController");
    this.threejs = threejsController;
    this.controls = new DragControls(
      msg.value.meches,
      this.threejs.camera_,
      this.threejs.threejs_.domElement
    );

    this.controls.addEventListener("dragstart", this.OnDragStart.bind(this));
    this.controls.addEventListener("dragend", this.OnDragEnd.bind(this));
  }

  OnDragStart(event) {
    this.isDragging = true;
    this.GlobalBroadcast({
      topic: "dragging.started",
      value: true,
    });
  }
  OnDragEnd(event) {
    this.isDragging = false;
    this.GlobalBroadcast({
      topic: "dragging.finished",
      value: true,
    });
  }

  OnResize_() {}

  Update(timeElapsed) {}

  Render() {}
}
