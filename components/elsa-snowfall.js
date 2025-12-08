// <elsa-snowfall> - Smart/Dynamic component that creates animated falling snowflakes
// Uses Canvas API for performance with many animated elements
// Attributes: density (1-100), speed (1-10), paused (boolean)
// Methods: start(), stop(), setIntensity(value)

class ElsaSnowfall extends HTMLElement {
  constructor() {
    super();
    this.snowflakes = [];
    this.animationId = null;
    this.canvas = null;
    this.ctx = null;
    this._animate = this._animate.bind(this);
  }

  connectedCallback() {
    // Get attributes
    const density = parseInt(this.getAttribute('density')) || 50;
    const speed = parseInt(this.getAttribute('speed')) || 5;
    const paused = this.hasAttribute('paused');

    // Create canvas for snowflakes
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none'; // Don't block clicks
    this.canvas.style.zIndex = '9999'; // On top of everything

    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    // Create initial snowflakes
    this.setIntensity(density, speed);

    // Start animation unless paused
    if (!paused) {
      this.start();
    }
  }

  disconnectedCallback() {
    this.stop();
    window.removeEventListener('resize', () => this._resizeCanvas());
  }

  static get observedAttributes() {
    return ['density', 'speed', 'paused'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.canvas) return; // Not initialized yet

    if (name === 'density' || name === 'speed') {
      const density = parseInt(this.getAttribute('density')) || 50;
      const speed = parseInt(this.getAttribute('speed')) || 5;
      this.setIntensity(density, speed);
    } else if (name === 'paused') {
      if (this.hasAttribute('paused')) {
        this.stop();
      } else {
        this.start();
      }
    }
  }

  _resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setIntensity(density, speed = 5) {
    // Density: 1-100 (number of snowflakes)
    // Speed: 1-10 (fall speed multiplier)
    const count = Math.floor((density / 100) * 150); // Max 150 snowflakes

    // Add or remove snowflakes to match density
    while (this.snowflakes.length < count) {
      this.snowflakes.push(this._createSnowflake());
    }
    while (this.snowflakes.length > count) {
      this.snowflakes.pop();
    }

    // Update speed for all snowflakes
    this.snowflakes.forEach(flake => {
      flake.speedY = (Math.random() * 1 + 0.5) * speed;
    });

    // Emit custom event
    const event = new CustomEvent('elsa-snowfall-change', {
      bubbles: true,
      detail: { density, speed, count: this.snowflakes.length }
    });
    this.dispatchEvent(event);
  }

  _createSnowflake() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height - this.canvas.height, // Start above screen
      speedY: Math.random() * 1 + 0.5,
      speedX: Math.random() * 0.5 - 0.25, // Slight horizontal drift
      radius: Math.random() * 3 + 1, // Size: 1-4px
      opacity: Math.random() * 0.6 + 0.4 // Opacity: 0.4-1.0
    };
  }

  _animate() {
    if (!this.canvas || !this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw each snowflake
    this.snowflakes.forEach(flake => {
      // Update position
      flake.y += flake.speedY;
      flake.x += flake.speedX;

      // Reset if off screen
      if (flake.y > this.canvas.height) {
        flake.y = -10;
        flake.x = Math.random() * this.canvas.width;
      }
      if (flake.x > this.canvas.width) {
        flake.x = 0;
      } else if (flake.x < 0) {
        flake.x = this.canvas.width;
      }

      // Draw snowflake (simple circle)
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this.ctx.fill();
    });

    // Continue animation
    this.animationId = requestAnimationFrame(this._animate);
  }

  start() {
    if (!this.animationId) {
      this.animationId = requestAnimationFrame(this._animate);
      this.removeAttribute('paused');
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.setAttribute('paused', '');
    }
  }

  // Public API for JavaScript
  get density() {
    return parseInt(this.getAttribute('density')) || 50;
  }

  set density(value) {
    this.setAttribute('density', value);
  }

  get speed() {
    return parseInt(this.getAttribute('speed')) || 5;
  }

  set speed(value) {
    this.setAttribute('speed', value);
  }
}

customElements.define('elsa-snowfall', ElsaSnowfall);

