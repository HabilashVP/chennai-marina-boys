import React,{Suspense,useMemo,useRef,useEffect} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Float,useTexture,Environment} from '@react-three/drei';
import {EffectComposer,Bloom,Vignette,Noise} from '@react-three/postprocessing';
import * as THREE from 'three';

const ROOT='/assets/';
const GOLD='#e6b45d';

function clamp(v,min=0,max=1){return Math.min(max,Math.max(min,v));}

function Dust({count=320,radius=8}){
  const positions=useMemo(()=>{
    const arr=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      arr[i*3]=(Math.random()-.5)*radius*2;
      arr[i*3+1]=(Math.random()-.5)*radius*1.4;
      arr[i*3+2]=(Math.random()-.5)*radius*1.4;
    }
    return arr;
  },[count,radius]);
  return <points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry>
    <pointsMaterial color="#f4c775" size={0.03} transparent opacity={0.7} sizeAttenuation depthWrite={false}/>
  </points>;
}

function SceneLights(){
  return <>
    <ambientLight intensity={0.88}/>
    <directionalLight position={[4,6,5]} color="#fff3d4" intensity={2.4}/>
    <pointLight position={[-3,-1,2]} color="#c31842" intensity={38} distance={10}/>
    <pointLight position={[2,2,4]} color="#f7b95c" intensity={42} distance={10}/>
  </>;
}

function CrestHero({progressRef}){
  const root=useRef();
  const {pointer}=useThree();
  const texture=useTexture(ROOT+'crest.webp');
  useFrame((state,dt)=>{
    if(!root.current)return;
    const p=clamp(progressRef?.current||0);
    root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,pointer.x*0.42+Math.sin(state.clock.elapsedTime*.28)*0.12+p*0.38,2.3,dt);
    root.current.rotation.x=THREE.MathUtils.damp(root.current.rotation.x,-pointer.y*0.24-p*0.08,2.3,dt);
    root.current.rotation.z=Math.sin(state.clock.elapsedTime*.18)*0.03;
    root.current.position.y=THREE.MathUtils.damp(root.current.position.y,-p*0.18,2.6,dt);
  });
  return <group ref={root} position={[1.75,0.2,0]} scale={1.24}>
    <mesh rotation={[Math.PI/2,0,0]}>
      <cylinderGeometry args={[2.1,2.1,0.26,96]}/>
      <meshStandardMaterial color="#b48438" metalness={0.92} roughness={0.22}/>
    </mesh>
    <mesh position={[0,0,0.136]}>
      <circleGeometry args={[2.04,96]}/>
      <meshBasicMaterial map={texture} toneMapped={false}/>
    </mesh>
    <mesh position={[0,0,0.152]}>
      <ringGeometry args={[1.98,2.14,96]}/>
      <meshStandardMaterial color="#ffd67f" metalness={0.9} roughness={0.18}/>
    </mesh>
    <mesh rotation={[0.62,0.4,0]}>
      <torusGeometry args={[2.48,0.016,6,180]}/>
      <meshBasicMaterial color="#ffcb6e" transparent opacity={0.62} toneMapped={false}/>
    </mesh>
    <mesh rotation={[-0.52,0.2,0]}>
      <torusGeometry args={[2.84,0.008,5,160]}/>
      <meshBasicMaterial color="#e7a851" transparent opacity={0.36} toneMapped={false}/>
    </mesh>
  </group>;
}

function DynamicCamera({progressRef,depth=8}){
  const {camera,pointer}=useThree();
  useFrame((_,dt)=>{
    const p=clamp(progressRef?.current||0);
    camera.position.x=THREE.MathUtils.damp(camera.position.x,pointer.x*0.35-p*0.1,2.3,dt);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,pointer.y*0.2,2.3,dt);
    camera.position.z=THREE.MathUtils.damp(camera.position.z,depth-p*0.5,2.3,dt);
    camera.lookAt(0,0,0);
  });
  return null;
}

function CinematicFX(){
  return <EffectComposer>
    <Bloom mipmapBlur luminanceThreshold={0.22} intensity={0.88} radius={0.75}/>
    <Noise opacity={0.02}/>
    <Vignette darkness={0.5} offset={0.2}/>
  </EffectComposer>;
}

export function HeroWorld({progressRef}){
  return <Canvas className="webgl-canvas" camera={{position:[0,0,8],fov:42}} dpr={[1,1.7]} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}}>
    <DynamicCamera progressRef={progressRef} depth={8}/>
    <SceneLights/>
    <Dust count={360} radius={9}/>
    <Suspense fallback={null}><Float speed={1.4} floatIntensity={0.28} rotationIntensity={0.05}><CrestHero progressRef={progressRef}/></Float></Suspense>
    <CinematicFX/>
  </Canvas>;
}

const photoVertex=`
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMix;
  void main(){
    vUv=uv;
    vec3 p=position;
    p.z += sin(uv.x*8.0 + uTime*0.5) * 0.018 * (0.35 + uMix);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
  }
`;

const photoFragment=`
  varying vec2 vUv;
  uniform sampler2D uBefore;
  uniform sampler2D uAfter;
  uniform float uMix;
  uniform float uTime;
  uniform vec2 uPointer;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} 
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x), f.y);
  }
  vec2 coverUv(vec2 uv,float imageAspect,float planeAspect){
    vec2 s=imageAspect>planeAspect?vec2(planeAspect/imageAspect,1.0):vec2(1.0,imageAspect/planeAspect);
    return (uv-0.5)*s+0.5;
  }
  void main(){
    vec2 uv=vUv;
    float grid=68.0;
    float cell=hash(floor(uv*grid));
    float organic=noise(uv*7.0+vec2(uTime*0.03,0.0));
    float threshold=mix(cell,organic,0.43);
    float p=clamp(uMix,0.0,1.0);
    float edge=smoothstep(p-0.12,p+0.12,threshold);
    float amount=1.0-edge;
    float glitch=4.0*amount*(1.0-amount);
    vec2 dir=uv-0.5;
    uv += dir*glitch*0.042 + vec2((cell-0.5)*glitch*0.033,0.0);
    vec2 ripple=uv-uPointer;
    uv += normalize(ripple+0.0001)*0.004*sin(length(ripple)*28.0-uTime*2.0)*exp(-length(ripple)*8.0);
    vec2 sampleUv=coverUv(uv,4.0/3.0,8.7/5.6);
    vec3 before=texture2D(uBefore,clamp(sampleUv,0.001,0.999)).rgb;
    vec3 after=texture2D(uAfter,clamp(sampleUv,0.001,0.999)).rgb;
    vec3 color=mix(before,after,amount);
    color += vec3(1.0,0.65,0.25)*glitch*0.24;
    color *= 0.88+0.12*smoothstep(0.0,1.0,vUv.y);
    gl_FragColor=vec4(color,1.0);
  }
`;

function PhotoShader({progressRef}){
  const mesh=useRef();
  const {pointer}=useThree();
  const [before,after]=useTexture([ROOT+'champ2021.webp',ROOT+'champ2024.webp']);
  const uniforms=useMemo(()=>({
    uBefore:{value:before},uAfter:{value:after},uMix:{value:0},uTime:{value:0},uPointer:{value:new THREE.Vector2(0.5,0.5)}
  }),[before,after]);
  useFrame(({clock},dt)=>{
    if(!mesh.current)return;
    const u=mesh.current.material.uniforms;
    const desired=THREE.MathUtils.smoothstep(clamp(progressRef?.current||0),0.18,0.84);
    u.uMix.value=THREE.MathUtils.damp(u.uMix.value,desired,4,Math.min(dt,0.05));
    u.uTime.value=clock.elapsedTime;
    u.uPointer.value.lerp(new THREE.Vector2(pointer.x*0.5+0.5,pointer.y*0.5+0.5),0.07);
  });
  return <mesh ref={mesh}>
    <planeGeometry args={[8.7,5.6,30,20]}/>
    <shaderMaterial uniforms={uniforms} vertexShader={photoVertex} fragmentShader={photoFragment} side={THREE.DoubleSide}/>
  </mesh>;
}

export function HistoryWorld({progressRef}){
  return <Canvas className="history-webgl" camera={{position:[0,0,7.5],fov:48}} dpr={[1,1.6]} gl={{alpha:false,antialias:true}}>
    <color attach="background" args={['#09111e']}/>
    <SceneLights/>
    <Dust count={100} radius={6}/>
    <Suspense fallback={null}><PhotoShader progressRef={progressRef}/></Suspense>
  </Canvas>;
}
