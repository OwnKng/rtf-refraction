import { Canvas } from "@react-three/fiber"
import CurveText from "./CurveText"

const App = () => (
  <Canvas
    orthographic
    camera={{ zoom: 100 }}
    onCreated={({ camera }) => {
      camera.position.setFromSphericalCoords(20, Math.PI / 3, -Math.PI / 4)
      camera.lookAt(0, 0, 0)
    }}
  >
    <CurveText text='NEXT GENERATION DIGITAL INSIGHTS   -   NEXT GENERATION DIGITAL INSIGHTS   -  ' />
  </Canvas>
)

export default App
