// src/components/ParticlesBackground/ParticlesBackground.js
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log("✅ Particles Init");
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: "#000000",
        },
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: {
            value: 0.5,
            random: true,
          },
          size: {
            value: 1.5,
            random: true,
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "top",
            outMode: "out",
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
