import * as THREE from "three";

import { Component } from "./ecs/entity";

import { math } from "./math.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class BackgroundCloud {
  constructor(params) {
    this.params_ = params;
    this.position_ = new THREE.Vector3();
    this.quaternion_ = new THREE.Quaternion();
    this.scale_ = 1.0;
    this.mesh_ = null;

    this.LoadModel_();
  }

  LoadModel_() {
    const loader = new GLTFLoader();
    loader.setPath("./resources/Clouds/GLTF/");
    loader.load("Cloud" + math.rand_int(1, 3) + ".glb", (glb) => {
      this.mesh_ = glb.scene;
      this.params_.scene.add(this.mesh_);

      this.position_.x = math.rand_range(-1000, 2000);
      this.position_.y = math.rand_range(-200, 200);
      this.position_.z = math.rand_range(-100, -1000);
      this.scale_ = math.rand_range(10, 20);

      const q = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        math.rand_range(0, 360)
      );
      this.quaternion_.copy(q);

      this.mesh_.traverse((c) => {
        if (c.geometry) {
          c.geometry.computeBoundingBox();
        }

        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            m.specular = new THREE.Color(0x000000);
            m.emissive = new THREE.Color(0xc0c0c0);
          }
        }
        c.castShadow = true;
        c.receiveShadow = true;
      });
    });
  }

  Update(timeElapsed) {
    if (!this.mesh_) {
      return;
    }

    this.position_.x -= timeElapsed * 10;

    this.mesh_.position.copy(this.position_);
    this.mesh_.quaternion.copy(this.quaternion_);
    this.mesh_.scale.setScalar(this.scale_);
  }
}

export class BackgroundController extends Component {
  constructor(params) {
    super();

    this.params_ = params;
    this.clouds_ = [];

    this.SpawnClouds_();
  }

  SpawnClouds_() {
    for (let i = 0; i < 25; ++i) {
      const cloud = new BackgroundCloud(this.params_);

      this.clouds_.push(cloud);
    }
  }

  Update(timeElapsed) {
    for (let c of this.clouds_) {
      c.Update(timeElapsed);
    }
  }
}
