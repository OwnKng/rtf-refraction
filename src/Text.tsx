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
        float time = uTime * 0.1; 

        vec2 repeat = vec2(2.0, 1.0); 

        vec2 _uv = fract(vUv * repeat + vec2(0.5, time)); 
        _uv = vec2(_uv.y, 1.0 - _uv.x); 

        vec4 color = texture2D(uTexture, _uv); 

        color = smoothstep(0.55, 0.6, color); 
        
        gl_FragColor = color; 
    }
`

const Text = () => {
  const { viewport } = useThree()
  const ref = useRef<THREE.Mesh>(null!)

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")

    const width = 400
    const text = "King"

    canvas.width = width
    canvas.height = width / 2

    const fontSize = canvas.height * 0.75

    const ctx = canvas.getContext("2d")
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

  useFrame(
    ({ clock }) =>
      // @ts-ignore
      (ref.current.material.uniforms.uTime.value = clock.getElapsedTime())
  )

  return (
    <mesh ref={ref} position={[0, 0, -3]} material={textMaterial}>
      <planeBufferGeometry args={[5, viewport.height]} />
    </mesh>
  )
}

export default Text
