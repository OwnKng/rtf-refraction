// @ts-nocheck
import { useMemo, useRef } from "react"
import { Text } from "troika-three-text"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { fragmentShader, vertexShader } from "./shader/shaders"

const Sketch = () => {
  const ref = useRef<THREE.Mesh>(null!)

  const { viewport } = useThree()

  const [rt, rtCamera, rtScene] = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )

    const rtCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    rtCamera.position.z = 20

    const rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color("#000000")

    const text = new Text()
    text.text = "next generation digital insights"

    text.fontSize = 1.2
    text.anchorX = "center"
    text.anchorY = "middle"

    rtScene.add(text)

    return [rt, rtCamera, rtScene, text]
  }, [])

  const uniforms = useMemo(
    () => ({
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uTexture: { value: rt.texture },
    }),
    [rt]
  )

  useFrame(({ gl, clock, mouse }) => {
    gl.setRenderTarget(rt)
    gl.render(rtScene, rtCamera)
    gl.setRenderTarget(null)

    ref.current.material.uniforms.uTime.value = clock.getElapsedTime()
    ref.current.material.uniforms.uMouse.value = new THREE.Vector2(
      mouse.x,
      mouse.y
    )
  })

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[viewport.width * 1.5, viewport.height * 2]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default Sketch
