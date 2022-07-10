import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import sourceSans from "./fonts/SourceSansPro.json"

import { Flow } from "three/examples/jsm/modifiers/CurveModifier"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"

const TWO_PI = Math.PI * 2
const numberOfPoints = 12

const radius = 20

const circle = Array.from(
  { length: numberOfPoints },
  (_, i) =>
    new THREE.Vector3(
      Math.sin((i / numberOfPoints) * TWO_PI) * radius,
      0,
      Math.cos((i / numberOfPoints) * TWO_PI) * radius
    )
)

const geometry = new THREE.PlaneBufferGeometry(TWO_PI * radius * 0.5, 4, 100, 1)

const material = new THREE.MeshPhongMaterial({
  color: "orange",
  side: THREE.DoubleSide,
})

const curve = new THREE.CatmullRomCurve3(circle, true, "centripetal")

const vertexShader = `
    varying vec2 vUv; 
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        vUv = uv; 
    }
`

const fragmentShader = `
    varying vec2 vUv; 

    void main() {
        gl_FragColor = vec4(vec3(vUv, 1.0), 1.0); 
    }
`

const Text = () => {
  const points = curve.getPoints(50)

  const texture = useTexture("hands.jpg")

  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial()
  )

  const flow = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    })

    geometry.rotateX(Math.PI)

    const objectToCurve = new THREE.Mesh(geometry, shaderMaterial)

    const flow = new Flow(objectToCurve, 1)
    flow.updateCurve(0, curve)

    return flow
  }, [])

  useFrame(() => {
    flow.moveAlongCurve(0.001)
  })

  return (
    <>
      <primitive object={line} />
      <primitive object={flow.object3D} />
    </>
  )
}

export default Text
