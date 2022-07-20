export const vertexShader = `
  uniform float uTime; 
  uniform sampler2D uTexture; 
    
  varying vec2 vUv;

  void main() {
    vec3 transformedPosition = position; 
    vec3 texture = texture2D(uTexture, uv).rgb;

    float disruption = sin(uv.x * 5.0) * 2.0; 
    transformedPosition.z += disruption; 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0); 
    vUv = uv; 
  }
`

export const fragmentShader = `
  uniform sampler2D uTexture; 
  varying vec2 vUv; 
  uniform float uTime;

  void main() {
    float time = uTime * 0.75;
    vec2 repeat = vec2(2., 6.);
    vec2 uv = fract(vUv * repeat + vec2(-time, 0.));
  
    vec3 texture = texture2D(uTexture, uv).rgb;
  
    gl_FragColor = vec4(texture, 1.);
  }
`
