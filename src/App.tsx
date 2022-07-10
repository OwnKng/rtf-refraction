import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import Text from "./Text"

const App = () => (
  <Canvas shadows>
    <OrbitControls />
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 0, -10]} />
    <Sketch />
  </Canvas>
)

export default App
