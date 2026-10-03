import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import { TwinMesh } from './TwinMesh'
import { useTwin } from '../twin/TwinContext'

function SceneContent() {
  const { entities, scene, setSelectedId } = useTwin()
  const cam = scene.camera
  const large = scene.id === 'chalco-plant'

  return (
    <>
      <color attach="background" args={['#121820']} />
      <fog attach="fog" args={['#121820', large ? 55 : 28, large ? 95 : 55]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[18, 28, 12]}
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={['#9eb6cc', '#1a222c', 0.4]} />

      <group onClick={() => setSelectedId(null)}>
        {entities.map((entity) => (
          <TwinMesh key={entity.id} entity={entity} />
        ))}
      </group>

      <Grid
        position={[0, 0.02, 0]}
        args={[large ? 80 : 40, large ? 80 : 40]}
        cellSize={1}
        cellThickness={0.55}
        cellColor="#2c3644"
        sectionSize={5}
        sectionThickness={1.05}
        sectionColor="#3d4d61"
        fadeDistance={large ? 70 : 40}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.35}
        scale={large ? 70 : 40}
        blur={2.4}
        far={16}
      />

      <OrbitControls
        makeDefault
        target={cam ? [cam.target.x, cam.target.y, cam.target.z] : [0, 0, 0]}
        maxPolarAngle={Math.PI * 0.49}
        minDistance={6}
        maxDistance={large ? 90 : 40}
      />
    </>
  )
}

export function SceneCanvas() {
  const { scene } = useTwin()
  const cam = scene.camera

  return (
    <Canvas
      key={scene.id}
      shadows
      camera={{
        position: cam
          ? [cam.position.x, cam.position.y, cam.position.z]
          : [14, 12, 14],
        fov: 42,
        near: 0.1,
        far: 300,
      }}
      dpr={[1, 1.75]}
    >
      <SceneContent />
    </Canvas>
  )
}
