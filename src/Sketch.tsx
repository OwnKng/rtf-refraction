import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { InstancedFlow } from "three/examples/jsm/modifiers/CurveModifier"

const TWO_PI = Math.PI * 2

const numberOfPoints = 20

const radius = 30

const circle = Array.from({ length: numberOfPoints }, (_, i) =>
  new THREE.Vector3()
    .setFromSphericalCoords(
      1,
      Math.PI / 2 + (Math.random() - 0.5),
      (i / numberOfPoints) * TWO_PI
    )
    .multiplyScalar(radius)
)

const curve = new THREE.CatmullRomCurve3(circle, true, "centripetal")

const box = new THREE.ConeBufferGeometry(1, 3, 5)
const boxMaterial = new THREE.MeshPhongMaterial({ color: "orange" })

const Sketch = () => {
  const ref = useRef(null!)

  const points = curve.getPoints(50)

  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial()
  )

  const flow = useMemo(() => {
    box.rotateZ(-Math.PI * 0.5)

    const numberOfInstances = 10
    const flow = new InstancedFlow(numberOfInstances, 1, box, boxMaterial)
    flow.updateCurve(0, curve)

    for (let i = 0; i < numberOfInstances; i++) {
      flow.setCurve(i, 0)
      flow.moveIndividualAlongCurve(i, (i * 1) / numberOfInstances)
    }

    return flow
  }, [])

  useFrame(() => flow.moveAlongCurve(0.001))

  return (
    <>
      <primitive object={line} />
      <primitive castShadow receiveShadow ref={ref} object={flow.object3D} />
    </>
  )
}

export default Sketch
