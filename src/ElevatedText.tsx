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
    const rt = new THREE.WebGLRenderTarget(2024, 2024)

    const rtCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)

    const rtScene = new THREE.Scene()
    rtScene.background = new THREE.Color("#000000")

    const text = new Text()
    text.text =
      "hello world from Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."

    text.fontSize = 1
    text.anchorX = "center"
    text.anchorY = "middle"
    text.color = "#fffffe"
    text.maxWidth = viewport.width
    text.lineHeight = 1.4
    text.textAlign = "justify"

    rtScene.add(text)

    return [rt, rtCamera, rtScene, text]
  }, [viewport])

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
    <mesh ref={ref} rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeBufferGeometry args={[viewport.width, viewport.height, 100, 100]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default Sketch
