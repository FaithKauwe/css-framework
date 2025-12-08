class ElsaToggle extends HTMLElement {
// this componenet has event listeners that need to be binded. binding creates a new function with 
// the correct 'this' context "locked in", creating a stable reference that can be added and removed (need to prevent memory leaks) .
// bind in the constructor instead of inline or in connectedCallback bc constructor runs only once  when component is created 

  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }
  
  connectedCallback() {
    // set up standard web accessibility attributes
    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', this.hasAttribute('checked'));
    
    const label = this.textContent.trim();
    
    // apply the elsa-toggle class and activates all CSS rules defined in elsa-components
    this.classList.add('elsa-toggle');
    
    if (this.hasAttribute('disabled')) {
      this.classList.add('elsa-toggle--disabled');
      this.setAttribute('aria-disabled', 'true');
    }
    
    // use all the specific classes defined in elsa-components.css to build the toggle
    this.innerHTML = `
      <div class="elsa-toggle__track">
        <div class="elsa-toggle__thumb"></div>
      </div>
      ${label ? `<span class="elsa-toggle__label">${label}</span>` : ''}
    `;
    
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);
    
    this._updateState();
  }
  
  // remove event listeners using the bound references from the constructor to prevent memory leaks
  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
  }
  
  static get observedAttributes() {
    return ['checked', 'disabled'];
  }
  // this method watches for changes to the checked and disabled attributes and updates the component's state
  // triggering the css changes and updating the aria attributes for screen readers
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      this.setAttribute('aria-checked', this.hasAttribute('checked'));
      this._updateState();
    } else if (name === 'disabled') {
      if (this.hasAttribute('disabled')) {
        this.classList.add('elsa-toggle--disabled');
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.classList.remove('elsa-toggle--disabled');
        this.removeAttribute('aria-disabled');
      }
    }
  }
  
  // event handlers
  _handleClick(e) {
    if (this.hasAttribute('disabled')) return;
    this.toggle();
  }
  
  _handleKeyDown(e) {
    if (this.hasAttribute('disabled')) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }
  // the core toggle logic, both handlers call this method
  toggle() {
    const wasChecked = this.hasAttribute('checked');
    
    if (wasChecked) {
      this.removeAttribute('checked');
    } else {
      this.setAttribute('checked', '');
    }
    
    const event = new CustomEvent('elsa-toggle', {
      bubbles: true,
      detail: { checked: !wasChecked }
    });
    this.dispatchEvent(event);
  }
  
  // helper method that updates the CSS class based on checked state
  _updateState() {
    if (this.hasAttribute('checked')) {
      this.classList.add('elsa-toggle--checked');
    } else {
      this.classList.remove('elsa-toggle--checked');
    }
  }
  
  // getters and setters for the checked attribute
  get checked() {
    return this.hasAttribute('checked');
  }
  
  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }
}

customElements.define('elsa-toggle', ElsaToggle);

