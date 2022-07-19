import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import * as THREE from 'three'

const App = () => (
  <Canvas
    orthographic
    camera={{ zoom: 100 }}
    onCreated={({ camera }) => {
      camera.position.setFromSphericalCoords(20, Math.PI / 3, -Math.PI / 4)
      camera.lookAt(0, 0, 0)
    }}
  >
    <Sketch
      color='blue'
      multisample
      samples={8}
      stencilBuffer={false}
      format={THREE.RGBFormat}
    />
  </Canvas>
)

export default App
