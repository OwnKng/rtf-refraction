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
    const rt = new THREE.WebGLRenderTarget(4048, 4048)

    const rtCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    rtCamera.position.z = 40

    const rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color("#000000")

    const text = new Text()
    text.text = "NEXT GENERATION DIGITAL INSIGHTS"

    text.fontSize = 1.8
    text.anchorX = "center"
    text.anchorY = "middle"
    text.color = "#fffffe"

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

  useFrame(({ gl }) => {
    gl.setRenderTarget(rt)
    gl.render(rtScene, rtCamera)
    gl.setRenderTarget(null)
  })

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default Sketch
