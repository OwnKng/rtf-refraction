import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <Canvas
  // orthographic
  // camera={{ zoom: 100 }}
  // onCreated={({ camera }) => {
  //   camera.position.setFromSphericalCoords(20, Math.PI / 3, -Math.PI / 4)
  //   camera.lookAt(0, 0, 0)
  // }}
  >
    <Sketch />
    <OrbitControls />
  </Canvas>
)

export default App
