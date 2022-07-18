// @ts-nocheck
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { fragmentShader, vertexShader } from "./shader/shaders"
import { Text } from "@react-three/drei"

const myText = "hello world from owen"

const Sketch = () => {
  const { viewport } = useThree()

  return (
    <group>
      <Text
        rotation={[-Math.PI * 0.5, 0, 0]}
        fontSize={1}
        maxWidth={viewport.width}
        height={viewport.height}
        lineHeight={1.4}
        textAlign='justify'
        anchorX='center'
        anchorY='middle'
        colorRanges={{ 0: "red", 8: "blue" }}
      >
        {myText}
        <meshBasicMaterial color='teal' side={THREE.DoubleSide} />
      </Text>
    </group>
  )
}

export default Sketch
