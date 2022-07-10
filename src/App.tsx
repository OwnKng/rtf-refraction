import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <Canvas shadows>
    <OrbitControls />
    <Sketch />
  </Canvas>
)

export default App
