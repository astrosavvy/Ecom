import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const plum = '#512636'
const hair = '#342019'
const skin = '#e6ad8d'
const gold = '#d8aa62'

function Limb({ side, mood }) {
  const arm = useRef()
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.z = side * (0.27 + Math.sin(clock.elapsedTime * 1.8) * 0.025 + (mood === 'asking' ? 0.09 : 0))
  })
  return <group ref={arm} position={[side * 0.81, 0.38, 0]} rotation={[0, 0, side * .27]}>
    <mesh position={[side * .18, -.43, .06]} rotation={[0, 0, side * .37]}>
      <capsuleGeometry args={[.21, .59, 6, 12]} /><meshStandardMaterial color={plum} roughness={.75} />
    </mesh>
    <mesh position={[side * .33, -.86, .13]} rotation={[0, 0, side * .37]}>
      <torusGeometry args={[.205, .012, 8, 32]} /><meshStandardMaterial color={gold} metalness={.7} roughness={.24} />
    </mesh>
    <mesh position={[side * .43, -1.08, .16]} rotation={[0, 0, side * .25]}>
      <sphereGeometry args={[.19, 24, 16]} /><meshStandardMaterial color={skin} roughness={.83} />
    </mesh>
  </group>
}

function Face({ mood }) {
  const head = useRef()
  const eyes = useRef()
  const mouth = useRef()
  useFrame(({ clock, pointer }) => {
    if (head.current) {
      head.current.rotation.y += ((pointer.x * .13) - head.current.rotation.y) * .055
      head.current.rotation.x += ((-pointer.y * .055) - head.current.rotation.x) * .055
    }
    const blink = Math.sin(clock.elapsedTime * 1.47) > .996 ? .07 : 1
    if (eyes.current) eyes.current.scale.y += (blink - eyes.current.scale.y) * .5
    if (mouth.current) mouth.current.scale.y += ((mood === 'asking' ? 1.75 : .7) - mouth.current.scale.y) * .12
  })
  return <group ref={head} position={[0, 1.25, .07]}>
    <mesh position={[0, 0, -.11]} scale={[.75, .91, .57]}>
      <sphereGeometry args={[1, 40, 28]} /><meshStandardMaterial color={hair} roughness={.67} />
    </mesh>
    <mesh scale={[.65, .76, .56]} position={[0, -.035, .12]}>
      <sphereGeometry args={[1, 40, 28]} /><meshStandardMaterial color={skin} roughness={.87} />
    </mesh>
    <mesh position={[.46, .44, -.5]} scale={[.36, .32, .3]}>
      <sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={hair} roughness={.7} />
    </mesh>
    <mesh position={[-.22, .58, .34]} rotation={[.12, -.22, -.34]} scale={[.49, .18, .26]}>
      <sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={hair} roughness={.7} />
    </mesh>
    <mesh position={[.31, .55, .23]} rotation={[0, .12, .28]} scale={[.37, .19, .28]}>
      <sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={hair} roughness={.7} />
    </mesh>
    <group ref={eyes}>
      {[-1, 1].map(side => <group key={side} position={[side * .24, .02, .60]}>
        <mesh scale={[.135, .095, .045]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#fff6e9" /></mesh>
        <mesh position={[side * -.012, 0, .039]} scale={[.068, .082, .034]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#38201a" roughness={.25} /></mesh>
        <mesh position={[-.02, .037, .067]} scale={[.022, .025, .01]}><sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="white" /></mesh>
        <mesh position={[0, .145, -.008]} rotation={[0, 0, side * -.12]} scale={[.15, .025, .025]}><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color={hair} /></mesh>
      </group>)}
    </group>
    <mesh position={[0, -.19, .67]} scale={[.075, .12, .08]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh ref={mouth} position={[0, -.37, .665]} scale={[.17, .035, .025]}>
      <sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color="#ae5361" roughness={.8} />
    </mesh>
    {[-1, 1].map(side => <group key={side} position={[side * .64, -.2, .11]}>
      <mesh><torusGeometry args={[.072, .012, 8, 24]} /><meshStandardMaterial color={gold} metalness={.8} roughness={.2} /></mesh>
      <mesh position={[0, -.08, 0]}><sphereGeometry args={[.044, 12, 8]} /><meshStandardMaterial color="#fff1d8" /></mesh>
    </group>)}
  </group>
}

function AsterFigure({ mood }) {
  const body = useRef()
  useFrame(({ clock }) => { if (body.current) body.current.position.y = -.18 + Math.sin(clock.elapsedTime * 1.25) * .022 })
  return <group ref={body} position={[0, -.18, 0]}>
    <mesh position={[0, -.04, -.13]} scale={[.88, .91, .43]}><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color={plum} roughness={.78} /></mesh>
    <mesh position={[0, .53, .05]}><cylinderGeometry args={[.17, .19, .36, 16]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[0, .18, .43]} rotation={[.12, 0, 0]} scale={[.32, .43, .055]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#f8e7d0" /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * .27, .23, .42]} rotation={[0, 0, side * .46]} scale={[.16, .53, .045]}><boxGeometry /><meshStandardMaterial color={plum} /></mesh>
      <mesh position={[side * .35, .12, .475]} rotation={[0, 0, side * .46]} scale={[.012, .55, .01]}><boxGeometry /><meshStandardMaterial color={gold} metalness={.65} roughness={.3} /></mesh>
      <Limb side={side} mood={mood} />
    </group>)}
    <mesh position={[.29, -.11, .43]}><sphereGeometry args={[.055, 14, 10]} /><meshStandardMaterial color={gold} metalness={.8} /></mesh>
    <Face mood={mood} />
  </group>
}

export default function Aster3D({ mood = 'listening', onFailure }) {
  return <Canvas camera={{ position: [0, .55, 4.2], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} dpr={[1, 1.6]}
    onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true })}>
    <ambientLight intensity={1.65} color="#fff1da" />
    <directionalLight position={[-3, 5, 5]} intensity={3} color="#fff2da" />
    <directionalLight position={[3, 1, -2]} intensity={2.1} color="#eeb474" />
    <AsterFigure mood={mood} />
  </Canvas>
}
