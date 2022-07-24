import { useThree, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const vertex = `
    varying vec2 vUv; 
    void main() {
        vUv = uv; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
    }
`

const fragment = `
    varying vec2 vUv; 

    void main() {
        gl_FragColor = vec4(vec3(vUv, 1.0), 1.0); 
    }
`

const vertexShader = `
varying vec3 vReflect; 
varying vec3 vRefract[3]; 
varying float vReflectionFactor; 

    void main() {
        float mRefractionRatio = 1.2; 
        float mFresnelBias = 0.2; 
        float mFresnelScale = 2.0; 
        float mFresnelPower = 1.2; 

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
  const { viewport } = useThree()

  const ref = useRef<THREE.Mesh>(null!)

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

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const width = 1024

    canvas.width = width
    canvas.height = width / 2

    const fontSize = canvas.height

    // @ts-ignore
    ctx.font = `Bold ${fontSize}px Arial`
    // @ts-ignore
    ctx.fillStyle = "white"
    // @ts-ignore
    ctx.fillText("Hello world", 0, canvas.height, width)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }, [])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: {} },
    }),
    []
  )

  useFrame(({ gl, scene, mouse }) => {
    cubeCamera.update(gl, scene)

    //@ts-ignore
    ref.current.material.uniforms.uTexture.value = cubeRenderTarget.texture

    ref.current.position.lerp(
      new THREE.Vector3(mouse.x * viewport.width, mouse.y * viewport.height, 0),
      0.05
    )
  })

  return (
    <>
      <mesh position={[0, 0, -2]}>
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ref}>
        <sphereBufferGeometry args={[2, 64, 64]} />
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
