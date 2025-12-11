// <elsa-snowfall> - Smart/Dynamic component that creates animated falling snowflakes
// Uses Canvas API- built in browser feature draws graphics directly in the browser using JS
// instead of creating 150 individual snowflake divs, draw everything on one canvas element, Erase and redraw 60 times per second
// the canvas eleemnt exists in the DOM but the snowflakes drawn on it do not
// Attributes: density (1-100), speed (1-10), paused (boolean)
// Methods: start(), stop(), setIntensity(value)

class ElsaSnowfall extends HTMLElement {
  constructor() {
    super();
    this.snowflakes = [];
    this.animationId = null;
    this.canvas = null;
    this.ctx = null;
  // set up the binding for the _animate method to ensure the correct 'this' context is used when the method is called
    this._animate = this._animate.bind(this);
  }

  connectedCallback() {
    // set up configuration attributes, used to control how the snowfall behaves
    const density = parseInt(this.getAttribute('density')) || 50;
    const speed = parseInt(this.getAttribute('speed')) || 5;
    const paused = this.hasAttribute('paused');

    // Create a canvas html element for snowflakes and set all the sizing and visual params
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none'; // Don't block clicks
    this.canvas.style.zIndex = '9999'; // On top of everything

    this.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d'); // get the 2d toolbox from Canvas API to access the 2d drawing methods

    // use an event listener to resize the canvas when the window is resized
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    // Create initial snowflakes using defaults
    this.setIntensity(density, speed);

    // Start animation unless paused
    if (!paused) {
      this.start();
    }
  }

  // clean up the event listenerwhen the component is removed to prevent memory leaks
  disconnectedCallback() {
    this.stop();
    window.removeEventListener('resize', () => this._resizeCanvas());
  }

  // configuration attributes that control overall snowfall behavior (these are the html attributes I want to watch)
  
  static get observedAttributes() {
    return ['density', 'speed', 'paused'];
  }

  // if the attribute changes, update the snowfall behavior using this method
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

  // sets the canvas size to match the window size (full screen). if the window changes, the window event listener will call the _resizeCanvas method
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

    // Emit custom event (it gets called, listened to, acted upon on web-components-demo.html, but it could have multiple listeners)
    const event = new CustomEvent('elsa-snowfall-change', {
    // bubbles: true allows the event propogation to travel upt the DOM tree to parent elements
    // allows parent elements to listen for the event 
      bubbles: true,
    // detail is the event payload, with the actual info about what changed
      detail: { density, speed, count: this.snowflakes.length }
    });
    // broadcasts the event
    this.dispatchEvent(event);
  }

  
  // private method used in the setIntensity method to create the snowflakes as plain javascript objects
  // canvas needs the JS objects to exist to remember they are there since there are no snowflake dom elements

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

  // private method used in the constructor and in start() to animate the snowflakes and recursively in itself to create an infinite animation loop, until stopped
  // updates positions and renders flakes to the canvas using JS object data, runs 60x/second in a recursive loop
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

      // beginPath starts drawing a new shape, simple circle (snowflake)
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this.ctx.fill();
    });

    // Continue animation- loop, 60x per second
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

  // Public API for any JavaScript code that wants to interact with the snowfall component
  // these getters and setters are JS property accessors (instead of attributes from the html setup
  // makes the component more accessible for JS, rather than having to use getAttribute and setAttribute )
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

// register the custom element with the browser, different than the custom event 
customElements.define('elsa-snowfall', ElsaSnowfall);

