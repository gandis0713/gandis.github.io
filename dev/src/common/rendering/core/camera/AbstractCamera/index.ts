

class AbstractCamera {
  constructor() {
    
  }

}

export default AbstractCamera;

// export default function Camera() {

//   this._state = {
//     lookAt: {
//       eye: [0, 0, 0.0001],
//       up: [0, 1, 0],
//       target: [0, 0, 0]
//     },
//     frustum: {
//       left: -150,
//       right: 150,
//       bottom: -150,
//       top: 150,
//       near: -1000,
//       far: 1000
//     },
//     wcvc: mat4.create(),
//     vcwc: mat4.create(),
//     vcpc: mat4.create(),
//     pcvc: mat4.create(),
//     wcpc: mat4.create(),
//     pcwc: mat4.create()
//   }

//   this._initialize = () => {
//     mat4.lookAt(this._state.wcvc, this._state.lookAt.eye, this._state.lookAt.target, this._state.lookAt.up);
//     mat4.invert(this._state.vcwc, this._state.wcvc);
//     mat4.ortho(this._state.vcpc, this._state.frustum.left, this._state.frustum.right, this._state.frustum.bottom, this._state.frustum.top, this._state.frustum.near, this._state.frustum.far);
//     mat4.invert(this._state.pcvc, this._state.vcpc);
//     mat4.multiply(this._state.wcpc, this._state.vcpc, this._state.wcvc);
//     mat4.invert(this._state.pcwc, this._state.wcpc);
//   }

//   this.setLootAt = (eye, target, up) => {
//     this._state.lookAt.eye = eye;
//     this._state.lookAt.target = target;
//     this._state.lookAt.up = up;
//     mat4.lookAt(this._state.wcvc, this._state.lookAt.eye, this._state.lookAt.target, this._state.lookAt.up);
//     mat4.invert(this._state.vcwc, this._state.wcvc);
//     mat4.multiply(this._state.wcpc, this._state.vcpc, this._state.wcvc);
//     mat4.invert(this._state.pcwc, this._state.wcpc);
//   }

//   this.setFrustum = (left, right, bottom, top, near, far) => {
//     this._state.frustum.left = left;
//     this._state.frustum.right = right;
//     this._state.frustum.bottom = bottom;
//     this._state.frustum.top = top;
//     this._state.frustum.near = near;
//     this._state.frustum.far = far;

//     mat4.ortho(this._state.vcpc, left, right, bottom, top, near, far);
//     mat4.invert(this._state.pcvc, this._state.vcpc);
//     mat4.multiply(this._state.wcpc, this._state.vcpc, this._state.wcvc);
//     mat4.invert(this._state.pcwc, this._state.wcpc);
//   }

//   this.zoom = (rate) => {

//     this._state.frustum.left -= rate;
//     this._state.frustum.right += rate;
//     this._state.frustum.bottom -= rate;
//     this._state.frustum.top += rate;
    
//     const { left, right, bottom, top, near, far } = this._state.frustum;

//     mat4.ortho(this._state.vcpc, left, right, bottom, top, near, far);
//     mat4.invert(this._state.pcvc, this._state.vcpc);
//     mat4.multiply(this._state.wcpc, this._state.vcpc, this._state.wcvc);
//     mat4.invert(this._state.pcwc, this._state.wcpc);
    
//   }

//   this.pan = (x, y) => {

//   }

//   this.orbit = (x, y) => {
//     const screenNormal = [0, 0, 1];
//     const dir = [x, y, 0];
//     const axis = vec3.create();
//     vec3.cross(axis, dir, screenNormal);

//     vec3.normalize(axis, axis);
    
//     let dgreeX = vec3.dot(axis, [1, 0, 0]);
//     let dgreeY = vec3.dot(axis, [0, 1, 0]);

//     const degreeAmount = 3.5;
//     dgreeX = dgreeX * Math.PI / 180.0;
//     dgreeY = dgreeY * Math.PI / 180.0;
//     dgreeX *= degreeAmount;
//     dgreeY *= degreeAmount;

//     const { eye, target, up } = this._state.lookAt;

//     const camTarToEye = vec3.create();
//     vec3.subtract(camTarToEye, eye, target);
//     vec3.normalize(camTarToEye, camTarToEye);
//     const camRight = vec3.create();
//     vec3.cross(camRight, up, camTarToEye);
//     vec3.normalize(camRight, camRight);

//     const camPitch = mat4.create();
//     mat4.fromRotation(camPitch, dgreeX, camRight);
//     const camYaw = mat4.create();
//     mat4.fromRotation(camYaw, dgreeY, up);

//     vec3.transformMat4(eye, eye, camPitch);
//     vec3.transformMat4(eye, eye, camYaw);

//     vec3.subtract(camTarToEye, eye, target);
//     vec3.normalize(camTarToEye, camTarToEye);
//     vec3.cross(up, camTarToEye, camRight);
//     vec3.normalize(up, up);
    
//     vec3.cross(camRight, up, camTarToEye);
//     vec3.normalize(camRight, camRight);

//     this.setLootAt(eye, target, up);
//   }

//   this.getState = () => {
//     return { ...this._state };
//   }

//   this._initialize();  
// }