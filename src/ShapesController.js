import { Component } from "./ecs/entity";
import * as THREE from "three";

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
};

export class ShapesFactory {
  constructor() {
    this.shapeTypes = {
      Triangle: "Triangle",
      Heart: "Heart",
      Square: "Square",
      Circle: "Circle",
      Pentagon: "Pentagon",
      Hexagon: "Hexagon",
      Fish: "Fish",
      Donut: "Donut",
      Smiley: "Smiley",
      Star: "Star",
      DavidStar: "DavidStar",
      Icosahedron: "Icosahedron",
      Octahedron: "Octahedron",
      Tetrahedron: "Tetrahedron",
      Sphere: "Sphere",
      Icosahedron: "Icosahedron",
      Octahedron: "Octahedron",
      Tetrahedron: "Tetrahedron",
      Dome: "Dome",
      Cylinder: "Cylinder",
      Cone: "Cone",
      Pyramid: "Pyramid",
      Torus: "Torus",
      TorusKnot: "TorusKnot",
      Prism: "Prism",
      ConeTruncated: "ConeTruncated",
      PyramidTruncated: "PyramidTruncated",
      Torus: "Torus",
      TorusKnot: "TorusKnot",
    };
  }

  Triangle() {
    const triangleShape = new THREE.Shape();
    (function createTriangleShape(ctx, x, y, w, h) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y); // close path
      return ctx;
    })(triangleShape, -50, -50, 100, 100);

    return {
      geometry: new THREE.ExtrudeGeometry(triangleShape, extrudeSettings),
      type: this.shapeTypes.Triangle,
    };
  }

  Heart() {
    const x = -25,
      y = 0;

    const heartShape = new THREE.Shape()
      .moveTo(x + 25, y + 25)
      .bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
      .bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
      .bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
      .bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
      .bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
      .bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

    return {
      geometry: new THREE.ExtrudeGeometry(heartShape, extrudeSettings),
      type: this.shapeTypes.Heart,
    };
  }

  Square() {
    const roundedRectShape = new THREE.Shape();

    (function roundedRect(ctx, x, y, width, height, radius) {
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + height - radius);
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
      ctx.lineTo(x + width - radius, y + height);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width,
        y + height - radius
      );
      ctx.lineTo(x + width, y + radius);
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
    })(roundedRectShape, -50, 0, 100, 100, 10);

    return {
      geometry: new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings),
      type: this.shapeTypes.Square,
    };
  }

  Circle() {
    const circleShape = new THREE.Shape();

    (function createCircleShape(ctx, x, y, radius) {
      ctx.moveTo(x, y);
      ctx.absarc(x, y, radius, 0, Math.PI * 2, false);
      return ctx;
    })(circleShape, 0, 30, 60);

    return {
      geometry: new THREE.ExtrudeGeometry(circleShape, extrudeSettings),
      type: this.shapeTypes.Circle,
    };
  }

  Pentagon() {
    const pentagonShape = new THREE.Shape();
    (function createPentagonShape(ctx, x, y, size) {
      ctx.moveTo(
        x + size * Math.cos(Math.PI / 2),
        y + size * Math.sin(Math.PI / 2)
      );
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          x + size * Math.cos(Math.PI / 2 + (i * (Math.PI * 2)) / 5),
          y + size * Math.sin(Math.PI / 2 + (i * (Math.PI * 2)) / 5)
        );
      }
      ctx.lineTo(
        x + size * Math.cos(Math.PI / 2),
        y + size * Math.sin(Math.PI / 2)
      ); // close path
      return ctx;
    })(pentagonShape, 0, 70, 50);

    return {
      geometry: new THREE.ExtrudeGeometry(pentagonShape, extrudeSettings),
      type: this.shapeTypes.Pentagon,
    };
  }

  Hexagon() {
    const hexagonShape = new THREE.Shape();
    (function hexagonShape(ctx, x, y, size) {
      ctx.moveTo(
        x + size * Math.cos(Math.PI / 2),
        y + size * Math.sin(Math.PI / 2)
      );
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos(Math.PI / 2 + (i * (Math.PI * 2)) / 6),
          y + size * Math.sin(Math.PI / 2 + (i * (Math.PI * 2)) / 6)
        );
      }
      ctx.lineTo(
        x + size * Math.cos(Math.PI / 2),
        y + size * Math.sin(Math.PI / 2)
      ); // close path
      return ctx;
    })(hexagonShape, 0, 70, 50);

    return {
      geometry: new THREE.ExtrudeGeometry(hexagonShape, extrudeSettings),
      type: this.shapeTypes.Hexagon,
    };
  }

  Fish() {
    const fishShape = new THREE.Shape();

    (function createFishShape(ctx, x, y, w, h) {
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + (w * 9) / 10, y - h / 10);
      ctx.quadraticCurveTo(x + w, y - h / 10, x + (w * 23) / 20, y - h / 2);
      ctx.quadraticCurveTo(x + w, y, x + (w * 23) / 20, y + h / 2);
      ctx.quadraticCurveTo(x + w, y + h / 10, x + (w * 9) / 10, y + h / 10);
      ctx.quadraticCurveTo(x + w / 2, y + h / 2, x, y);
      return ctx;
    })(fishShape, -50, 50, 100, 100);

    return {
      geometry: new THREE.ExtrudeGeometry(fishShape, extrudeSettings),
      type: this.shapeTypes.Fish,
    };
  }

  Donut() {
    const donutShape = new THREE.Shape();

    (function createDonutShape(ctx, x, y, innerRadius, outerRadius) {
      ctx.moveTo(x + outerRadius, y);
      ctx.absarc(x, y, outerRadius, 0, Math.PI * 2, false);
      const holePath = new THREE.Path();
      holePath.moveTo(x + innerRadius, y);
      holePath.absarc(x, y, innerRadius, 0, Math.PI * 2, true);
      ctx.holes.push(holePath);
      return ctx;
    })(donutShape, 0, 60, 40, 60);

    return {
      geometry: new THREE.ExtrudeGeometry(donutShape, extrudeSettings),
      type: this.shapeTypes.Donut,
    };
  }

  Smiley() {
    const smileyShape = new THREE.Shape();
    (function createSmileyFaceShape(ctx, x, y, size) {
      ctx.moveTo(x, y + size / 2);
      ctx.absarc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, false);
      const smileyEye1Path = new THREE.Path();
      smileyEye1Path.moveTo(x + size / 4, y + (size * 3) / 4);
      smileyEye1Path.absellipse(
        x + size / 5,
        y + (size * 3) / 4,
        size / 10,
        size / 10,
        0,
        Math.PI * 2,
        true
      );
      const smileyEye2Path = new THREE.Path();
      smileyEye2Path.moveTo(x + (size * 3) / 4, y + (size * 3) / 4);
      smileyEye2Path.absarc(
        x + (size * 4) / 5,
        y + (size * 3) / 4,
        size / 10,
        0,
        Math.PI * 2,
        true
      );
      const smileyMouthPath = new THREE.Path();
      smileyMouthPath.moveTo(x + size / 5, y + size / 2);
      smileyMouthPath.quadraticCurveTo(
        x + size / 2,
        y + size / 4,
        x + (size * 4) / 5,
        y + size / 2
      );
      smileyMouthPath.bezierCurveTo(
        x + (size * 9) / 10,
        y + size / 2 - size / 8,
        x + (size * 9) / 10,
        y + size / 2 - size / 4,
        x + (size * 4) / 5,
        y + size / 4
      );
      smileyMouthPath.quadraticCurveTo(
        x + size / 2,
        y,
        x + size / 5,
        y + size / 4
      );
      smileyMouthPath.quadraticCurveTo(
        x,
        y + size / 2 - size / 4,
        x + size / 5,
        y + size / 2
      );
      ctx.holes.push(smileyEye1Path);
      ctx.holes.push(smileyEye2Path);
      ctx.holes.push(smileyMouthPath);
      return ctx;
    })(smileyShape, -50, -25, 100);

    return {
      geometry: new THREE.ExtrudeGeometry(smileyShape, extrudeSettings),
      type: this.shapeTypes.Smiley,
    };
  }

  Star() {
    const starShape = new THREE.Shape();

    (function createStarShape(ctx, x, y, size) {
      ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * 2 * Math.PI) / 5),
          y + size * Math.sin((i * 2 * Math.PI) / 5)
        );
        ctx.lineTo(
          x + (size / 2) * Math.cos(((i * 2 + 1) * Math.PI) / 5),
          y + (size / 2) * Math.sin(((i * 2 + 1) * Math.PI) / 5)
        );
      }
      ctx.closePath();
      return ctx;
    })(starShape, 0, 50, 60);

    return {
      geometry: new THREE.ExtrudeGeometry(starShape, extrudeSettings),
      type: this.shapeTypes.Star,
    };
  }

  DavidStar() {
    const starShape = new THREE.Shape();

    (function createStarShape(ctx, x, y, size) {
      ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + size * Math.cos((i * 2 * Math.PI) / 6),
          y + size * Math.sin((i * 2 * Math.PI) / 6)
        );
        ctx.lineTo(
          x + (size / 2) * Math.cos(((i * 2 + 1) * Math.PI) / 6),
          y + (size / 2) * Math.sin(((i * 2 + 1) * Math.PI) / 6)
        );
      }
      ctx.closePath();
      return ctx;
    })(starShape, 0, 50, 60);

    return {
      geometry: new THREE.ExtrudeGeometry(starShape, extrudeSettings),
      type: this.shapeTypes.DavidStar,
    };
  }

  Icosahedron() {
    console.log(THREE);

    const shape = new THREE.IcosahedronGeometry(40, 0); // radius, subdivisions

    return {
      geometry: new THREE.Shape(shape),
      type: this.shapeTypes.Icosahedron,
    };
  }

  Octahedron() {
    const shape = new THREE.OctahedronGeometry(40, 0);

    return { geometry: shape, type: this.shapeTypes.Octahedron };
  }

  Tetrahedron() {
    const shape = new THREE.TetrahedronGeometry(40, 0);

    return { geometry: shape, type: this.shapeTypes.Tetrahedron };
  }

  Sphere() {
    const shape = new THREE.SphereGeometry(40, 32, 16);

    return { geometry: shape, type: this.shapeTypes.Sphere };
  }

  Icosahedron() {
    const shape = new THREE.IcosahedronGeometry(40, 1); // radius, subdivisions

    return { geometry: shape, type: this.shapeTypes.Icosahedron };
  }

  Octahedron() {
    const shape = new THREE.OctahedronGeometry(40, 1);

    return { geometry: shape, type: this.shapeTypes.Octahedron };
  }

  Tetrahedron() {
    const shape = new THREE.TetrahedronGeometry(40, 1);

    return { geometry: shape, type: this.shapeTypes.Tetrahedron };
  }

  Dome() {
    const shape = new THREE.SphereGeometry(
      40,
      32,
      16,
      0,
      2 * Math.PI,
      0,
      Math.PI / 2
    );

    return { geometry: shape, type: this.shapeTypes.Dome };
  }

  Cylinder() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(30, 30, 80, 20, 4);

    return { geometry: shape, type: this.shapeTypes.Cylinder };
  }

  Cone() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(0, 30, 100, 20, 4);

    return { geometry: shape, type: this.shapeTypes.Cone };
  }

  Pyramid() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(0, 30, 100, 4, 4);

    return { geometry: shape, type: this.shapeTypes.Pyramid };
  }

  Torus() {
    // radius of entire torus, diameter of tube (less than total radius);
    // segments around radius, segments around torus ("sides")
    const shape = new THREE.TorusGeometry(25, 10, 8, 4);

    return { geometry: shape, type: this.shapeTypes.Torus };
  }

  TorusKnot() {
    // total knot radius, tube radius, number cylinder segments, sides per cyl. segment,
    //  p-loops around torus, q-loops around torus
    const shape = new THREE.TorusKnotGeometry(30, 8, 60, 10, 2, 3);

    return { geometry: shape, type: this.shapeTypes.TorusKnot };
  }

  Prism() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(30, 30, 80, 6, 4);

    return { geometry: shape, type: this.shapeTypes.Prism };
  }

  ConeTruncated() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(10, 30, 100, 20, 4);

    return { geometry: shape, type: this.shapeTypes.ConeTruncated };
  }

  PyramidTruncated() {
    // radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
    const shape = new THREE.CylinderGeometry(15, 30, 100, 6, 4);

    return { geometry: shape, type: this.shapeTypes.PyramidTruncated };
  }

  Torus() {
    // radius of entire torus, diameter of tube (less than total radius);
    // sides per cylinder segment, cylinders around torus ("sides")
    const shape = new THREE.TorusGeometry(30, 20, 16, 40);

    return { geometry: shape, type: this.shapeTypes.Torus };
  }

  TorusKnot() {
    // total knot radius, tube radius, number cylinder segments, sides per cyl. segment,
    //  p-loops around torus, q-loops around torus
    const shape = new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 7);

    return { geometry: shape, type: this.shapeTypes.TorusKnot };
  }
}
