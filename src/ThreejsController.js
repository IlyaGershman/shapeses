import { Component } from "./ecs/entity";
import * as THREE from "three";

const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

export class ThreejsController extends Component {
  constructor() {
    super();
  }

  InitEntity() {
    this.threejs_ = new THREE.WebGLRenderer({
      antialias: false,
    });

    this.threejs_.shadowMap.enabled = true;
    this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs_.setPixelRatio(window.devicePixelRatio);
    console.log(window.innerWidth, window.innerHeight);
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
    this.threejs_.domElement.id = "threejs";

    document
      .getElementById("shapes-game")
      .appendChild(this.threejs_.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.OnResize_();
      },
      false
    );

    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.5;
    const far = 10000.0;
    this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera_.position.set(0, 0, 500);
    this.camera_.lookAt(0, 0, 0);

    this.scene_ = new THREE.Scene();
    this.scene_.background = new THREE.Color(0xbfd1e5);
    this.scene_.add(this.camera_);

    // const cameraLight = new THREE.PointLight(0xffffff, 0.8);
    // this.camera_.add(cameraLight);

    let hemiLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene_.add(hemiLight);

    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-30, 50, 1000);
    this.scene_.add(dirLight);
    dirLight.castShadow = true;

    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0x89b2eb) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };
    const skyGeo = new THREE.SphereGeometry(1000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: _VS,
      fragmentShader: _FS,
      side: THREE.BackSide,
    });
    this.scene_.add(new THREE.Mesh(skyGeo, skyMat));

    this.OnResize_();
  }

  AttachCameraHelper() {
    var helper = new THREE.CameraHelper(this.camera_);
    this.scene_.add(helper);
  }

  AttachAxesHelper() {
    const axesHelper = new THREE.AxesHelper(5000);
    this.scene_.add(axesHelper);
  }

  OnResize_() {
    this.camera_.aspect = window.innerWidth / window.innerHeight;
    this.camera_.updateProjectionMatrix();
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  Update(timeElapsed) {
    // console.log({ timeElapsed });
  }

  Render() {
    this.threejs_.render(this.scene_, this.camera_);
  }

  GetMostRightPoint(distance) {
    var fov = ((this.camera_.fov / 180) * Math.PI) / 2;

    var right = Math.tan(fov) * distance * this.camera_.aspect;

    return right;
  }

  GetCanvasWidth() {
    return this.threejs_.domElement.width;
  }

  GetCanvasHeight() {
    return this.threejs_.domElement.height;
  }
}
