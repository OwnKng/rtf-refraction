// @ts-nocheck
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { vertexShader, fragmentShader } from "./shader/shaders"

const Sketch = (props: any) => {
  const { viewport } = useThree()
  const { width, height } = viewport

  const ref = useRef()

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = 300
    canvas.height = 300

    const fontSize = canvas.height
    const fontStyle = `Bold ${fontSize}px Arial`
    const text = "text"

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = fontStyle
    ctx.fillStyle = "black"

    ctx.fillText(text, 0, fontSize, 300)

    //@ts-ignore
    const texture = new THREE.CanvasTexture(ctx.canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
    }),
    [texture]
  )

  useFrame(
    ({ clock }) =>
      (ref.current.material.uniforms.uTime.value = clock.getElapsedTime())
  )

  return (
    <mesh ref={ref} rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeBufferGeometry args={[viewport.width, viewport.height, 100, 100]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export default Sketch
