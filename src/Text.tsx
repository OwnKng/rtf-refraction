import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const vertexShader = `
    varying vec2 vUv; 
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
    }
`

const fragmentShader = `
    uniform sampler2D uTexture; 
    uniform float uTime; 

    varying vec2 vUv; 

    void main() {
      float time = uTime * 0.5;
      vec2 repeat = vec2(3.0, 5.0);
      vec2 _uv = fract(vUv * repeat + vec2(-time, 0.5)); 
      float color = texture2D(uTexture, _uv).r; 

      color = smoothstep(0.3, 1.0, color); 
      
      gl_FragColor = vec4(vec3(color), 1.0); 
    }
`

const Text = () => {
  const { viewport } = useThree()
  const ref = useRef<THREE.Group>(null!)

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")

    const width = 512
    const text = "CORNER"

    canvas.width = width
    canvas.height = width / 2

    const fontSize = canvas.height

    const ctx = canvas.getContext("2d")

    // @ts-ignore
    ctx.fillStyle = "black" // border color
    // @ts-ignore
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // @ts-ignore
    ctx.font = `Bold ${fontSize}px Arial`

    // @ts-ignore
    ctx.fillStyle = "white"

    // @ts-ignore
    ctx.fillText(text, 0, fontSize, width)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }, [])

  const textMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
        },
      }),
    [texture]
  )

  // useFrame(({ clock }) => {
  //   textMaterial.uniforms.uTime.value = clock.getElapsedTime()
  // })

  return (
    <group ref={ref} position={[viewport.width * 0.5, 0.5, 0]}>
      <mesh
        position={[-viewport.width * 0.5, 0, viewport.width * 0.5]}
        rotation={[0, Math.PI * 0.5, 0]}
        material={textMaterial}
      >
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} material={textMaterial}>
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
      </mesh>
    </group>
  )
}

export default Text
