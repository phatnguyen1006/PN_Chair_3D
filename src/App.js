import React, { useRef, useEffect, useState, Suspense, Children } from "react";
import "./App.scss";
// R3F
import { Canvas, events, useFrame } from "@react-three/fiber";
import { Html, useProgress, useGLTF } from "@react-three/drei";

// React Spring
import { a, useTransition } from "@react-spring/web";
//Intersection Observer
import { useInView } from "react-intersection-observer";

// components
import Header from "./components/Header/Header";
import state from "./components/State";
import { Section } from "./components/Section/Section";

import "./styles.css";

// function to load a model
function Model({ url }) {
  const gltf = useGLTF(url, true);
  return <primitive object={gltf.scene} dispose={null} />;
}

const Light = () => {
  return (
    <>
      <ambientLight insensity={0.3} />
      <directionalLight position={[10, 10, 5]} insensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadowMapWidth={1024}
        shadowMapHeight={1024}
        shadowCameraTop={10}
        shadowCameraBottom={-10}
        shadowCameraLeft={-10}
        shadowCameraRight={10}
        shadowCameraFar={50}
      />
      {/* Spotlight Large overhead light */}
      <spotLight position={[1000, 0, 0]} castShadow insensity={1} />
    </>
  );
};

const HTMLContent = ({
  domContent,
  children,
  modelPath,
  bgColor,
  position
}) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));
  // observer
  const [refItem, inView] = useInView({
    threshold: 0 // no margin
  });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);

  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <Model url={modelPath} />
        </mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className="container">
            <h1 className="title">{children}</h1>
          </div>
        </Html>
      </group>
    </Section>
  );
};

function Loader() {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress }
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className="loading" style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
  );
}

export default function App() {
  const [events, setEvents] = useState();
  const domContent = useRef();
  const scrollArea = useRef();

  // function
  const onScroll = (e) => {
    state.top.current = e.target.scrollTop;
  };

  // cycles
  useEffect(() => void onScroll({ target: scrollArea.current }));

  return (
    <>
      <Header />
      <div className="container">
        <Canvas mode="concurrent" camera={{ position: [0, 0, 120], fov: 70 }}>
          <Light />
          <Suspense fallback={null}>
            <HTMLContent
              bgColor="#f15946"
              position={250}
              domContent={domContent}
              modelPath="/armchairYellow.gltf"
            >
              <span>Hello</span>
            </HTMLContent>
            <HTMLContent
              bgColor="#571ec1"
              position={0}
              domContent={domContent}
              modelPath="/armchairGray.gltf"
            >
              <span>I'm Phat Nguyen</span>
            </HTMLContent>
            <HTMLContent
              bgColor="#636567"
              position={-250}
              domContent={domContent}
              modelPath="/armchairGreen.gltf"
            >
              <span>Web Developer</span>
            </HTMLContent>
          </Suspense>
        </Canvas>
      </div>
      <Loader />
      <div
        className="scroll-area"
        ref={scrollArea}
        onScroll={onScroll}
        {...events}
      >
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}
