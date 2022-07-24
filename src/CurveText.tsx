import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { Text } from "@react-three/drei"
//@ts-ignore
import { createDerivedMaterial } from "troika-three-utils"

const CurveText = ({ text }: { text: string }) => {
  const textRef = useRef(null!)

  const { viewport } = useThree()

  const material = useMemo(
    () =>
      createDerivedMaterial(new THREE.MeshBasicMaterial(), {
        uniforms: {
          // Total width of the text, assigned on synccomplete
          textLength: { value: 0 },
          uRadius: { value: viewport.width * 0.33 },
        },
        vertexDefs: `
            uniform float textLength;
            uniform float uRadius; 
          `,
        vertexTransform: `
            float scale = 1.0 / textLength * PI * 1.98;
            float theta = -position.x * scale;
            float r = uRadius;
            float r2 = r + position.y * scale * r;
            position.x = cos(theta) * r2;
            position.y = sin(theta) * r2;
          `,
        timeUniform: "time",
      }),
    [viewport]
  )

  const calculateBounds = (textObj: any) => {
    //@ts-ignore
    const bounds = textObj._textRenderInfo.blockBounds
    material.uniforms.textLength.value = Math.max(bounds[2] - bounds[0], 30)
  }

  //@ts-ignore
  useFrame(() => (textRef.current.rotation.z += 0.001))

  return (
    <>
      <Text
        position={[0, 0, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        ref={textRef}
        fontSize={1}
        material={material}
        onSync={(textObj) => calculateBounds(textObj)}
        anchorX='center'
        anchorY='bottom'
        textAlign='center'
        font='https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
        color='white'
      >
        {text}
      </Text>
      <>
        <mesh position={[0, 0, 0]}>
          <icosahedronBufferGeometry args={[5, 1]} />
          <meshBasicMaterial wireframe />
        </mesh>
      </>
    </>
  )
}

export default CurveText
