import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import { OrbitControls } from "@react-three/drei"

const App = () => (
  <Canvas shadows>
    <OrbitControls />
    <Sketch />
  </Canvas>
)

export default App
