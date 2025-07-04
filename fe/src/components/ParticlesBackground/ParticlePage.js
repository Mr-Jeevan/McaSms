import React from 'react';
import ParticlesParakaVidrom from './ParticlesParakaVidrom'; // Bring in our star-making component
import './ParticlePage.css'; // Don't forget to create this CSS file later!

// This component acts like a special background layer
const ParticlePage = ({ children }) => {
  return (
    <div className="particle-background-container">
      {/* This is our actual star-making component, which fills the background */}
      <ParticlesParakaVidrom />

      {/* This is where your other content (like the login form) will go.
          It will sit on top of the stars. */}
      <div className="particle-content-overlay">
        {children} {/* 'children' means whatever you put inside <ParticlePage> in your Login component */}
      </div>
    </div>
  );
};

export default ParticlePage; // Let other components use our starry wallpaper frame