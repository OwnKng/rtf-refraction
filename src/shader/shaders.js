import glsl from "babel-plugin-glsl/macro"

export const vertexShader = glsl`
    #pragma glslify: rotate = require(glsl-rotate/rotate)
    uniform sampler2D uTexture; 
    
    varying vec2 vUv;

    float HALF_PI = 3.142 / 8.0; 

    void main() {
        vec3 transformedPosition = position; 
        vec3 texture = texture2D(uTexture, uv).rgb;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0); 
        vUv = uv; 
    }
`

export const fragmentShader = glsl`
  uniform sampler2D uTexture; 
  varying vec2 vUv; 

  void main() {
    vec3 texture = texture2D(uTexture, vUv).rgb;

    if(texture.r == 0.0 && texture.b == 0.0) discard;

    float strength = texture.r * 1.0; 
    strength = max(strength, 0.2); 

    gl_FragColor = vec4(vec3(strength), 1.0);
  }
`
