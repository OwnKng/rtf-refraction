import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { InstancedFlow } from "three/examples/jsm/modifiers/CurveModifier"

const TWO_PI = Math.PI * 2

const numberOfPoints = 50

const radius = 5

const circle = Array.from(
  { length: numberOfPoints },
  (_, i) =>
    new THREE.Vector3(
      Math.sin((i / numberOfPoints) * TWO_PI) * radius,
      Math.cos((i / numberOfPoints) * TWO_PI) * radius,
      0
    )
)

const box = new THREE.BoxBufferGeometry(0.1, 0.1, 0.5)
const boxMaterial = new THREE.MeshPhongMaterial({ color: "orange" })

const Sketch = () => {
  const ref = useRef(null!)

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(circle, true, "centripetal"),
    []
  )

  const flow = useMemo(() => {
    box.rotateX(Math.PI)

    const numberOfInstances = 100
    const flow = new InstancedFlow(numberOfInstances, 1, box, boxMaterial)
    flow.updateCurve(0, curve)

    for (let i = 0; i < numberOfInstances; i++) {
      flow.setCurve(i, 0)
      flow.moveIndividualAlongCurve(i, (i * 1) / numberOfInstances)
    }

    return flow
  }, [curve])

  return <primitive castShadow receiveShadow ref={ref} object={flow.object3D} />
}

export default Sketch
