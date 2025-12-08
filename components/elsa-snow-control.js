// <elsa-snow-control> - Interactive slider to control snowfall intensity
// Finds <elsa-snowfall> component and adjusts its density/speed
// Attributes: target (CSS selector for snowfall element), initial-value (0-100)
// Emits: 'elsa-snow-change' custom event when slider moves

class ElsaSnowControl extends HTMLElement {
  constructor() {
    super();
    this._handleInput = this._handleInput.bind(this);
  }

  connectedCallback() {
    const initialValue = parseInt(this.getAttribute('initial-value')) || 50;
    const target = this.getAttribute('target') || 'elsa-snowfall';
    const label = this.textContent.trim() || 'Snow Intensity';

    // Build control structure
    this.innerHTML = `
      <div class="elsa-snow-control">
        <label class="elsa-snow-control__label">
          <span class="elsa-snow-control__text">${label}</span>
          <span class="elsa-snow-control__value">${initialValue}%</span>
        </label>
        <input 
          type="range" 
          class="elsa-snow-control__slider" 
          min="0" 
          max="100" 
          value="${initialValue}"
          aria-label="${label}"
        />
      </div>
    `;

    // Get slider element
    this.slider = this.querySelector('.elsa-snow-control__slider');
    this.valueDisplay = this.querySelector('.elsa-snow-control__value');

    // Add event listener
    this.slider.addEventListener('input', this._handleInput);

    // Store target selector
    this._targetSelector = target;

    // Initial update
    this._updateSnowfall(initialValue);
  }

  disconnectedCallback() {
    if (this.slider) {
      this.slider.removeEventListener('input', this._handleInput);
    }
  }

  _handleInput(e) {
    const value = parseInt(e.target.value);
    this.valueDisplay.textContent = `${value}%`;
    this._updateSnowfall(value);

    // Emit custom event
    const event = new CustomEvent('elsa-snow-change', {
      bubbles: true,
      detail: { intensity: value }
    });
    this.dispatchEvent(event);
  }

  _updateSnowfall(intensity) {
    // Find snowfall component
    const snowfall = document.querySelector(this._targetSelector);
    
    if (snowfall && snowfall.setIntensity) {
      // intensity: 0-100
      // density: number of snowflakes (0-100)
      // speed: fall speed (1-10), scales with intensity
      const density = intensity;
      const speed = Math.max(1, Math.floor((intensity / 100) * 10));
      
      snowfall.setIntensity(density, speed);
    }
  }

  // Public API
  get value() {
    return this.slider ? parseInt(this.slider.value) : 50;
  }

  set value(val) {
    if (this.slider) {
      this.slider.value = val;
      this.valueDisplay.textContent = `${val}%`;
      this._updateSnowfall(val);
    }
  }
}

customElements.define('elsa-snow-control', ElsaSnowControl);

