import glsl from "babel-plugin-glsl/macro"

export const vertexShader = glsl`
    #pragma glslify: rotate = require(glsl-rotate/rotate)
    
    varying vec2 vUv;

    float HALF_PI = 3.142 / 8.0; 

    void main() {
        vec3 transformedPosition = position; 
        vec3 axis = vec3(0.0, 0.0, -1.0); 
        transformedPosition = rotate(transformedPosition, axis, HALF_PI);

        gl_Position = projectionMatrix *  modelViewMatrix * vec4(transformedPosition, 1.0); 
        vUv = uv; 
    }
`

export const fragmentShader = glsl`
  uniform sampler2D uTexture; 
  uniform float uTime; 
  uniform vec2 uMouse; 

  varying vec2 vUv; 

  void main() {
    
    float time = uTime * 0.2;

    vec2 repeat = vec2(1.0, 6.0);
    vec2 uv = fract(vUv * repeat);

    float zoom = 0.1; 
    vec2 scaleCenter = vec2(0.5);
    uv.y = (uv.y - scaleCenter.y) * zoom + scaleCenter.y;

    vec3 texture = texture2D(uTexture, uv).rgb;
    float color = step(0.7, texture.r); 
  
    gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);
  }
`
