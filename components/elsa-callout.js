// elsa-callout is a web component (a static box with customizable slots), the custom tag <elsa-callout>  and it's variants can be used 
// user can use the provided slots (icon, title, content) to customize the callout 

// special method that the browser calls when custom element is added to the DOM
class ElsaCallout extends HTMLElement {
  
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'info';
    
    // apply the base class and variant modifier
    this.classList.add('elsa-callout', `elsa-callout--${variant}`);
    
    // find the slotted content the user provided and save in variables
    const icon = this.querySelector('[slot="icon"]');
    const title = this.querySelector('[slot="title"]');
    const content = Array.from(this.childNodes).filter(
      node => !node.slot || node.slot === 'default'
    );
    
    // clear the element's HTML content with an empty string in order to rebuild with the callout structure
    // some components use shadow DOM instead of the clear/ rebuild technique, but this component doesn't use shadow DOM
    this.innerHTML = '';
    
    // rebuild the structure using the slot variables saved above
    const wrapper = document.createElement('div');
    wrapper.className = 'elsa-callout__wrapper';
    
    if (icon) {
      const iconContainer = document.createElement('div');
      iconContainer.className = 'elsa-callout__icon';
      iconContainer.appendChild(icon);
      wrapper.appendChild(iconContainer);
    }
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'elsa-callout__content';
    
    if (title) {
      title.className = 'elsa-callout__title';
      contentContainer.appendChild(title);
    }
    
    const body = document.createElement('div');
    body.className = 'elsa-callout__body';
    content.forEach(node => body.appendChild(node.cloneNode(true)));
    contentContainer.appendChild(body);
    
    wrapper.appendChild(contentContainer);
    this.appendChild(wrapper);
  }
}

customElements.define('elsa-callout', ElsaCallout);

