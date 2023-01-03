import { Component } from "./ecs/entity";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { ShapesFactory } from "./ShapesController";
import { randomlyPickFromArray } from "./utils";

export class LevelController extends Component {
  constructor() {
    super();

    this.ammountOfShapesInLevel = 4;
    const shapes = new ShapesFactory();
    this.shapesList = [
      shapes.Triangle(),
      shapes.Heart(),
      shapes.Square(),
      shapes.Circle(),
      shapes.Pentagon(),
      shapes.Hexagon(),
      shapes.Fish(),
      shapes.Donut(),
      shapes.Star(),
      shapes.DavidStar(),
      shapes.Sphere(),
      shapes.Icosahedron(),
      shapes.Octahedron(),
      shapes.Dome(),
      shapes.Cylinder(),
      shapes.Cone(),
      shapes.Pyramid(),
      shapes.TorusKnot(),
      shapes.Prism(),
      shapes.ConeTruncated(),
      shapes.PyramidTruncated(),
      shapes.Torus(),
    ];
    this.draggableObjects = [];
    this.targetObjects = {};
    this.foundShapes = {};
    this.levelSceneObjectGroup = null;
    this.score = 0;
    this.level = 1;
    this.velocity_ = 50.0;
    this.position_ = new THREE.Vector3(-200, -50, 400);
  }

  InitEntity() {
    this.threejs_ =
      this.FindEntity("renderer").GetComponent("ThreejsController");

    this.RegisterHandler("level.complited", (m) => this.OnNewLevel(m));
    this.LoadModel_();
    this.OnStart();
  }

  GetMechFromGeometry(geometry, color, x, y, z, rx, ry, rz, s) {
    if (!geometry) {
      debugger;
    }

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color: color })
    );
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);

    return mesh;
  }

  AssembleLevel_() {
    this.levelSceneObjectGroup = new THREE.Group();

    const mostRightPoint = this.threejs_.GetMostRightPoint(500);

    const points = (function getFrustumPoints(camera, distance) {
      // Calculate the field of view in radians
      var fov = ((camera.fov / 180) * Math.PI) / 2;

      // Calculate the width and height of the frustum at the given distance
      var frustumHeight = 2 * Math.tan(fov) * distance;
      var frustumWidth = frustumHeight * camera.aspect;

      // Calculate the top-left, top-right, bottom-left, and bottom-right points of the frustum
      var topLeft = new THREE.Vector3(
        -frustumWidth / 2,
        frustumHeight / 2,
        -distance
      );
      var topRight = new THREE.Vector3(
        frustumWidth / 2,
        frustumHeight / 2,
        -distance
      );
      var bottomLeft = new THREE.Vector3(
        -frustumWidth / 2,
        -frustumHeight / 2,
        -distance
      );
      var bottomRight = new THREE.Vector3(
        frustumWidth / 2,
        -frustumHeight / 2,
        -distance
      );

      // Return an array of the points of the frustum
      return [topLeft, topRight, bottomRight, bottomLeft];
    })(this.threejs_.camera_, 500);

    var width = points[1].x - points[0].x;
    var height = points[0].y - points[2].y;

    function createFloor() {
      let pos = { x: 0, y: 0, z: 0 };
      let scale = { x: width - 400, y: 10, z: height };

      let blockPlane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: 0xf9c834 })
      );
      blockPlane.position.set(pos.x, pos.y, pos.z);
      blockPlane.rotation.set(-Math.PI / 2, 0, 0);
      blockPlane.scale.set(scale.x, scale.y, scale.z);
      blockPlane.castShadow = true;
      blockPlane.receiveShadow = true;
      blockPlane.userData.ground = true;
      return blockPlane;
    }
    const meshColors = [
      0xffd700, 0xffa500, 0xb22222, 0x00bfff, 0x228b22, 0x8b008b, 0xff00ff,
      0xd2691e, 0x0000ff, 0x808080,
    ];
    this.threejs_.scene_.add(createFloor());

    const mechesDrag = [];
    const shapes = randomlyPickFromArray(this.shapesList, 4);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i].geometry;
      const mech = this.GetMechFromGeometry(
        shape,
        meshColors[this.level % meshColors.length],
        i % 2 ? mostRightPoint - 120 : -mostRightPoint + 120,
        Math.floor(i / 2) * 250 - 130,
        10,
        0,
        0,
        0,
        2
      );

      mech.castShadow = true;
      mech.receiveShadow = true;
      mechesDrag.push({ mech, type: shapes[i].type });
      this.levelSceneObjectGroup.add(mech);
    }

    const mechesAim = {};
    const getShuffledArr = (arr) => {
      const newArr = arr.slice();
      for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
      }
      return newArr;
    };

    const shapesShuffled = getShuffledArr(shapes);
    console.log({ levelsShuffled: shapesShuffled });
    const numberOfCols = 2;

    for (let i = 0; i < shapesShuffled.length; i++) {
      const shape = shapesShuffled[i].geometry;
      const mech = this.GetMechFromGeometry(
        shape,
        0x000000,
        (i % numberOfCols) * 300 - 170,
        Math.floor(i / numberOfCols) * 250 - 130,
        0,
        0,
        0,
        0,
        2
      );

      mechesAim[shapesShuffled[i].type] = mech;
      this.levelSceneObjectGroup.add(mech);
    }

    this.threejs_.scene_.add(this.levelSceneObjectGroup);

    console.log({ mechesAim });
    this.targetObjects = mechesAim;
    this.draggableObjects = mechesDrag;
    this.Broadcast({
      topic: "level.assembled",
      value: {
        meches: mechesDrag.map(({ mech }) => mech),
        levels: this.levels,
      },
    });
  }

  DestroyLevel_() {
    this.draggableObjects = [];
    this.targetObjects = {};
    this.foundShapes = {};
    this.threejs_.scene_.remove(this.levelSceneObjectGroup);
    this.levelSceneObjectGroup = null;
  }

  OnStart() {
    this.AssembleLevel_();
  }

  OnNewLevel() {
    this.DestroyLevel_();
    this.level += 1;
    this.position_ = new THREE.Vector3(-200, -50, 400);
    this.AssembleLevel_();
  }

  OnResize_() {}

  LoadModel_() {
    const loader = new FBXLoader();
    loader.setPath("./resources/Dinosaurs/FBX/");
    loader.load("Velociraptor.fbx", (fbx) => {
      fbx.scale.setScalar(0.16);
      fbx.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

      this.mesh_ = fbx;
      this.threejs_.scene_.add(this.mesh_);

      fbx.traverse((c) => {
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            m.specular = new THREE.Color(0x000000);
            m.color.offsetHSL(0, 0, 0.25);
          }
        }
        c.castShadow = true;
        c.receiveShadow = true;
      });

      const m = new THREE.AnimationMixer(fbx);
      this.mixer_ = m;

      for (let i = 0; i < fbx.animations.length; ++i) {
        if (fbx.animations[i].name.includes("Run")) {
          const clip = fbx.animations[i];
          const action = this.mixer_.clipAction(clip);
          action.play();
        }
      }
    });
  }

  Update(timeElapsed) {
    for (let i = 0; i < this.draggableObjects.length; i++) {
      const { mech, type } = this.draggableObjects[i];

      if (this.foundShapes[type]) continue;

      const targetMech = this.targetObjects[type];

      if (mech.position.distanceTo(targetMech.position) < 20) {
        mech.position.set(targetMech.position.x, targetMech.position.y, 10);
        this.foundShapes[type] = true;
        this.score += 1;

        document.getElementById(
          "score"
        ).innerHTML = `SCORE: ${this.score} | LEVEL: ${this.level}`;

        this.Broadcast({
          topic: "shape.found",
          value: {
            meches: this.draggableObjects
              .filter((o) => !this.foundShapes[o.type])
              .map(({ mech }) => mech),
          },
        });
      }

      if (
        Object.keys(this.foundShapes).length === this.ammountOfShapesInLevel
      ) {
        this.Broadcast({ topic: "level.completed" });
        this.OnNewLevel();
      }
    }

    this.position_.x += timeElapsed * this.velocity_;
    this.velocity_ = Math.max(this.velocity_, -100);

    if (this.mesh_) {
      this.mixer_.update(timeElapsed);
      this.mesh_.position.copy(this.position_);
    }
  }

  Render() {}
}
