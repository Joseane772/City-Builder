import { useEffect } from 'react';
import * as THREE from 'three';
import Scene from './components/Scene';
import Ground from './components/Ground';
import Simulation from "./components/Simulation.js";

function App() {
  useEffect(() => {
    const simulation = new Simulation("myThreeJsCanvas");

    return () => {
      simulation.scene.renderer.dispose();
    };

    }, []);

  return (
    <div className="root">
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;