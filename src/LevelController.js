import { Component } from "./ecs/entity";
import * as THREE from "three";
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
      shapes.Smiley(),
      shapes.Star(),
      shapes.DavidStar(),
      shapes.Icosahedron(),
      shapes.Octahedron(),
      shapes.Tetrahedron(),
      shapes.Sphere(),
      shapes.Icosahedron(),
      shapes.Octahedron(),
      shapes.Tetrahedron(),
      shapes.Dome(),
      shapes.Cylinder(),
      shapes.Cone(),
      shapes.Pyramid(),
      shapes.Torus(),
      shapes.TorusKnot(),
      shapes.Prism(),
      shapes.ConeTruncated(),
      shapes.PyramidTruncated(),
      shapes.Torus(),
      shapes.TorusKnot(),
    ];
    this.draggableObjects = [];
    this.targetObjects = {};
    this.foundShapes = {};
    this.levelSceneObjectGroup = null;
  }

  InitEntity() {
    this.threejs_ =
      this.FindEntity("renderer").GetComponent("ThreejsController");

    this.RegisterHandler("shapes.matched", (m) => this.OnNewLevel(m));
    this.RegisterHandler("level.complited", (m) => this.OnNewLevel(m));
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
      let pos = { x: -50, y: 0, z: 0 };
      let scale = { x: width / 1.3, y: 10, z: height / 1.3 };

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

    this.threejs_.scene_.add(createFloor());

    const mechesDrag = [];
    const shapes = randomlyPickFromArray(this.shapesList, 4);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i].geometry;
      const mech = this.GetMechFromGeometry(
        shape,
        0x008000,
        mostRightPoint - 100,
        i * 140 - 250,
        10,
        0,
        0,
        0,
        1
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
        (i % numberOfCols) * 420 - 200,
        Math.floor(i / numberOfCols) * 250 - 150,
        0,
        0,
        0,
        0,
        1
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
    this.AssembleLevel_();
  }

  OnResize_() {}

  Update(timeElapsed) {
    for (let i = 0; i < this.draggableObjects.length; i++) {
      const { mech, type } = this.draggableObjects[i];

      if (this.foundShapes[type]) continue;

      const targetMech = this.targetObjects[type];

      if (mech.position.distanceTo(targetMech.position) < 20) {
        mech.position.set(targetMech.position.x, targetMech.position.y, 10);
        this.foundShapes[type] = true;
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
  }

  Render() {}
}
