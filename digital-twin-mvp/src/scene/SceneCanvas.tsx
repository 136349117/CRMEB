import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import { TwinMesh } from './TwinMesh'
import { useTwin } from '../twin/TwinContext'

function SceneContent() {
  const { entities, scene, setSelectedId } = useTwin()
  const cam = scene.camera

  return (
    <>
      <color attach="background" args={['#121820']} />
      <fog attach="fog" args={['#121820', 28, 55]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        position={[12, 18, 8]}
        intensity={1.15}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={['#8fa3b8', '#1a222c', 0.35]} />

      <group onClick={() => setSelectedId(null)}>
        {entities.map((entity) => (
          <TwinMesh key={entity.id} entity={entity} />
        ))}
      </group>

      <Grid
        position={[0, 0.02, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2c3644"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#3d4d61"
        fadeDistance={40}
        infiniteGrid
      />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2.4} far={12} />

      <OrbitControls
        makeDefault
        target={cam ? [cam.target.x, cam.target.y, cam.target.z] : [0, 0, 0]}
        maxPolarAngle={Math.PI * 0.49}
        minDistance={4}
        maxDistance={40}
      />
    </>
  )
}

export function SceneCanvas() {
  const { scene } = useTwin()
  const cam = scene.camera

  return (
    <Canvas
      shadows
      camera={{
        position: cam
          ? [cam.position.x, cam.position.y, cam.position.z]
          : [14, 12, 14],
        fov: 45,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 1.75]}
    >
      <SceneContent />
    </Canvas>
  )
}
