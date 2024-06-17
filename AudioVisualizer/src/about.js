const template = document.createElement("template");
template.innerHTML = `
<link href="styles/styles.css" type="text/css" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"> 

<img src="">
</img>


`;



class AboutPage extends HTMLElement{
    constructor(){
        super();
        //1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode:"open"});
        //2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.img = this.shadowRoot.querySelector("img");
    }
    static get observedAttributes(){
        return ["data-image"];
    }
    //3 - called when the component is added to the page

    attributeChangedCallback(attributeName, oldVal, newVal){
        console.log(attributeName, oldVal, newVal);
        this.render();
    }
    connectedCallback(){
        this.render();
    }

    //4 - a helper method to display the values of the attributes
    render(){
        const imgURL = this.getAttribute('data-image') ? this.getAttribute('data-image') : "./images/sound-wave.jpg";
        
        this.img.src = imgURL;
    }
}
customElements.define('about-page', AboutPage);