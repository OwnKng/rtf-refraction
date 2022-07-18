import glsl from "babel-plugin-glsl/macro"

export const vertexShader = glsl`
    #pragma glslify: rotate = require(glsl-rotate/rotate)
    
    varying vec2 vUv;

    float HALF_PI = 3.142 / 8.0; 

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        vUv = uv; 
    }
`

export const fragmentShader = glsl`
  uniform sampler2D uTexture; 
  varying vec2 vUv; 

  void main() {
    vec3 texture = texture2D(uTexture, vUv).rgb;
  
    gl_FragColor = vec4(texture, 1.0);
  }
`
