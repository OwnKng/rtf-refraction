// @ts-nocheck
import { useMemo, useRef } from "react"
import { Text } from "troika-three-text"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

const vertexShader = `
  varying vec2 vUv; 
  void main() {
    vec3 transformedPosition = position; 


    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0); 
    vUv = uv; 
  }
`

const fragmentShader = `
  uniform sampler2D uTexture; 
  uniform float uTime; 

  varying vec2 vUv; 

  void main() {
    float time = uTime * 0.1;
    vec2 repeat = vec2(5., 6.);
    vec2 uv = fract(vUv * repeat + vec2(time, 0.));
  
    vec3 texture = texture2D(uTexture, uv).rgb;

    if(texture.r < 0.1) discard; 
  
    gl_FragColor = vec4(texture, 1.0);
  }
`

const Sketch = () => {
  const ref = useRef<THREE.Mesh>(null!)

  const [rt, rtCamera, rtScene] = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )

    const rtCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    rtCamera.position.z = 40

    const rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color("#000000")

    const text = new Text()
    text.text = "Hello World!"

    text.fontSize = 2.4
    text.anchorX = "center"
    text.anchorY = "middle"

    rtScene.add(text)

    return [rt, rtCamera, rtScene, text]
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: rt.texture },
    }),
    [rt]
  )

  useFrame(({ gl, scene, camera, clock }) => {
    gl.setRenderTarget(rt)
    gl.render(rtScene, rtCamera)
    gl.setRenderTarget(null)

    ref.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={ref} rotation={[0, 0, Math.PI * 0.2]}>
      <icosahedronBufferGeometry args={[30, 8]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default Sketch
