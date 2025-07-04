import React, { useRef, useEffect, useState, useCallback } from 'react';
import './ParticlesParakaVidrom.css';

// --- ALL CONSTANTS ARE DEFINED HERE (GLOBAL TO THE MODULE) ---
// Now every class and function in this file can see these!
const NUM_STARS = 2000; // How many little stars
const STAR_MIN_SIZE = 1; // Smallest star size
const STAR_MAX_SIZE = 3; // Biggest star size
const STAR_MIN_SPEED = 0.1; // Slowest star speed
const STAR_MAX_SPEED = 0.3; // Fastest star speed

const SHOOTING_STAR_INTERVAL_MS = 1000; // Average interval for new shooting stars (1 second)
const SHOOTING_STAR_MIN_LENGTH = 50; // Shortest shooting star tail
const SHOOTING_STAR_MAX_LENGTH = 150; // Longest shooting star tail
const SHOOTING_STAR_MIN_SPEED = 5; // Slowest shooting star
const SHOOTING_STAR_MAX_SPEED = 15; // Fastest shooting star
const SHOOTING_STAR_HEAD_SIZE = 3; // Size of the shooting star's 'head' in pixels

// --- STAR CLASS IS DEFINED HERE (OUTSIDE THE COMPONENT) ---
// This blueprint for a normal "static" star can now see the constants above.
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight; // Stars can initially spawn anywhere
        this.size = Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) + STAR_MIN_SIZE;

        // Base directional movement from user input
        this.baseDirectionX = 3; // Move right
        this.baseDirectionY = -3; // Move up

        // Apply a random speed multiplier to the base directions for varied speeds
        this.speedMultiplier = Math.random() * (STAR_MAX_SPEED - STAR_MIN_SPEED) + STAR_MIN_SPEED;
        this.speedX = this.baseDirectionX * this.speedMultiplier;
        this.speedY = this.baseDirectionY * this.speedMultiplier;

        this.initialOpacity = Math.random() * 0.7 + 0.3;
        this.twinklePhase = Math.random() * Math.PI * 2;
    }

    // Make the star move and twinkle
    update(canvasWidth, canvasHeight) {
        this.x += this.speedX;
        this.y += this.speedY;

        // If the star moves off the right edge (x > canvasWidth) OR the top edge (y < 0)
        if (this.x > canvasWidth || this.y < 0) {
            // Reset it to a random position on the bottom edge OR the left edge
            if (Math.random() < 0.5) { // Reappear from a random X at the bottom (y=canvasHeight)
                this.x = Math.random() * canvasWidth;
                this.y = canvasHeight;
            } else { // Reappear from a random Y at the left (x=0)
                this.x = 0;
                this.y = Math.random() * canvasHeight;
            }

            // Re-randomize speed multiplier and re-calculate speeds upon reset
            this.speedMultiplier = Math.random() * (STAR_MAX_SPEED - STAR_MIN_SPEED) + STAR_MIN_SPEED;
            this.speedX = this.baseDirectionX * this.speedMultiplier;
            this.speedY = this.baseDirectionY * this.speedMultiplier;

            this.initialOpacity = Math.random() * 0.7 + 0.3;
            // --- CRUCIAL CHANGE: Randomize twinkle phase upon reset ---
            this.twinklePhase = Math.random() * Math.PI * 2; // Assign a new random phase
        }

        // Twinkling opacity logic
        this.opacity = this.initialOpacity * (0.5 + 0.5 * Math.abs(Math.sin(Date.now() * 0.001 + this.twinklePhase)));
    }

    // Draw the star on the drawing board
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// --- SHOOTING STAR CLASS IS DEFINED HERE (OUTSIDE THE COMPONENT) ---
// This blueprint for a shooting star can also see the constants above.
class ShootingStar {
    constructor(canvasWidth, canvasHeight) {
      this.reset(canvasWidth, canvasHeight);
    }

    reset(canvasWidth, canvasHeight) {
      const edge = Math.random();
      if (edge < 0.5) {
        this.x = Math.random() * canvasWidth;
        this.y = 0; // Starts from top edge
      } else {
        this.x = 0; // Starts from left edge
        this.y = Math.random() * canvasHeight;
      }

      this.length = Math.random() * (SHOOTING_STAR_MAX_LENGTH - SHOOTING_STAR_MIN_LENGTH) + SHOOTING_STAR_MIN_LENGTH;
      this.speed = Math.random() * (SHOOTING_STAR_MAX_SPEED - SHOOTING_STAR_MIN_SPEED) + SHOOTING_STAR_MIN_SPEED;
      this.angle = Math.PI / 4 + (Math.random() * Math.PI / 8); // Angle for top-left to bottom-right
      this.opacity = 1;
      this.active = true;
    }

    update(canvasWidth, canvasHeight) {
      if (!this.active) return;

      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      this.opacity -= 0.01; // Fade out as it moves

      if (this.x > canvasWidth + this.length || this.y > canvasHeight + this.length || this.opacity <= 0) {
        this.active = false; // Deactivate when off-screen or fully faded
      }
    }

    draw(ctx) {
      if (!this.active) return;

      const headX = this.x;
      const headY = this.y;

      // Calculate the tail's end point
      const tailEndX = this.x - this.length * Math.cos(this.angle);
      const tailEndY = this.y - this.length * Math.sin(this.angle);

      // --- Draw the HEAD (a distinct circle) ---
      ctx.beginPath();
      ctx.arc(headX, headY, SHOOTING_STAR_HEAD_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();

      // --- Draw the FADING TAIL (using a linear gradient) ---
      const gradient = ctx.createLinearGradient(
        headX, headY,
        tailEndX, tailEndY
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(tailEndX, tailEndY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = SHOOTING_STAR_HEAD_SIZE * 0.8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
}

// --- PARTICLES COMPONENT (Main React component) ---
const ParticlesParakaVidrom = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const stars = useRef([]);
  const shootingStars = useRef([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  // The animation loop, wrapped in useCallback for performance
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Stop if canvas is not available

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Stop if context is not available

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the new frame

    // Update and draw static stars
    stars.current.forEach(star => {
      star.update(canvas.width, canvas.height);
      star.draw(ctx);
    });

    // Filter out inactive shooting stars and then update/draw active ones
    shootingStars.current = shootingStars.current.filter(s => s.active);
    shootingStars.current.forEach(s => {
      s.update(canvas.width, canvas.height);
      s.draw(ctx);
    });

    // Randomly create new shooting stars
    if (Math.random() < 1 / (SHOOTING_STAR_INTERVAL_MS / (1000 / 60))) {
      shootingStars.current.push(new ShootingStar(canvas.width, canvas.height));
    }

    // Request the next animation frame to keep the loop going
    animationFrameId.current = requestAnimationFrame(animate);
  }, []); // Dependencies are empty, so 'animate' function reference is stable

  // --- useEffect 1: Handles canvas dimensions and window resizing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Update the size state to make the canvas redraw at the new size
        setCanvasDimensions({ width: parent.clientWidth, height: parent.clientHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set dimensions correctly on mount

    // Cleanup function: remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Runs once on mount

  // --- useEffect 2: Initializes stars and starts the animation loop ---
  // This effect depends on canvasDimensions to ensure stars are created with correct size.
  useEffect(() => {
    const canvas = canvasRef.current;
    // Only proceed if canvas exists AND has valid non-zero dimensions
    if (!canvas || canvasDimensions.width === 0 || canvasDimensions.height === 0) {
      return; // Wait until dimensions are known (width/height are not 0)
    }

    // Initialize static stars ONLY when dimensions are known and non-zero
    stars.current = Array.from({ length: NUM_STARS }, () => new Star(canvasDimensions.width, canvasDimensions.height));
    shootingStars.current = []; // Clear any existing shooting stars when re-initializing

    // Start animation only once to prevent multiple loops
    if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(animate);
    }

    // Cleanup function: cancel animation frame when component unmounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [canvasDimensions.width, canvasDimensions.height, animate]); // Re-run if dimensions change or animate function changes

  return (
    <div className="particles-canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      ></canvas>
    </div>
  );
};

export default ParticlesParakaVidrom;