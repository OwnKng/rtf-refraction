import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <Canvas shadows>
    <OrbitControls />
    <ambientLight intensity={0.5} />
    <Sketch />
  </Canvas>
)

export default App
