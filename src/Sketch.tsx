import { useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import Text from "./Text"

const vertexShader = `
varying vec3 vReflect; 
varying vec3 vRefract[3]; 
varying float vReflectionFactor; 

    void main() {
        float mRefractionRatio = 1.02; 
        float mFresnelBias = 0.4; 
        float mFresnelScale = 2.0; 
        float mFresnelPower = 2.0; 

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0); 
        vec4 worldPosition = modelMatrix * vec4(position, 1.0); 

        vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

        vec3 I = worldPosition.xyz - cameraPosition; 

        vReflect = reflect(I, worldNormal); 
        vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio); 
        vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.99); 
        vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.98); 

        vReflectionFactor = mFresnelBias + mFresnelScale * pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);
       
        gl_Position = projectionMatrix * modelViewPosition; 
    }
`

const fragmentShader = `
    uniform samplerCube uTexture; 

    varying vec3 vReflect;
    varying vec3 vRefract[3]; 
    varying float vReflectionFactor;

    void main() {
        vec4 reflectedColor = textureCube(uTexture, vec3(-vReflect.x, vReflect.yz));
        vec4 refractedColor = vec4(1.0); 

        refractedColor.r = textureCube(uTexture, vec3(-vRefract[0].x, vRefract[0].yz)).r; 
        refractedColor.g = textureCube(uTexture, vec3(-vRefract[1].x, vRefract[1].yz)).g; 
        refractedColor.b = textureCube(uTexture, vec3(-vRefract[2].x, vRefract[2].yz)).b;
        
        gl_FragColor = mix(refractedColor, reflectedColor, clamp(vReflectionFactor, 0.0, 1.0));
    }
`

const Sketch = () => {
  const ref = useRef<THREE.Mesh>(null!)

  const { viewport } = useThree()

  const cubeRenderTarget = useMemo(
    () =>
      new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipMapLinearFilter,
        encoding: THREE.sRGBEncoding,
      }),
    []
  )

  const cubeCamera = useMemo(
    () => new THREE.CubeCamera(0.1, 10, cubeRenderTarget),
    [cubeRenderTarget]
  )

  const uniforms = useMemo(
    () => ({
      uTexture: { value: {} },
    }),
    []
  )

  useFrame(({ gl, scene }) => {
    cubeCamera.update(gl, scene)

    //@ts-ignore
    ref.current.material.uniforms.uTexture.value = cubeRenderTarget.texture
  })

  return (
    <>
      <Text />
      <mesh ref={ref} position={[4, 2, 4]}>
        <sphereBufferGeometry args={[3, 32, 32]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  )
}

export default Sketch
