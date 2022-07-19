import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, useFBO } from "@react-three/drei"
import { createPortal } from "@react-three/fiber"
import { PerspectiveCamera } from "three"

const myText = "hello world from owen"

const Texture = () => (
  <mesh>
    <boxBufferGeometry />
    <meshBasicMaterial color='teal' />
  </mesh>
)

const Sketch = (props: any) => {
  const target = useFBO({ ...props })

  const cam = useRef<PerspectiveCamera>(null!)

  const scene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(props.color)

    return scene
  }, [props.color])

  useFrame(({ gl }) => {
    gl.setRenderTarget(target)
    gl.render(scene, cam.current)
    gl.setRenderTarget(null)
  })

  return (
    <>
      <perspectiveCamera ref={cam} position={[0, 0, 10]} />
      {createPortal(<Texture />, scene)}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[10, 10]} />
        <meshBasicMaterial map={target.texture} />
      </mesh>
    </>
  )
}

export default Sketch
