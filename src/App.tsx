import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <Canvas orthographic camera={{ zoom: 100 }}>
    <Sketch />
    <OrbitControls />
  </Canvas>
)

export default App
