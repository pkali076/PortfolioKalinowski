const template2 = document.createElement("template");
template2.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

    <style>
    .current-page #styles:hover{
        background-color:rgba(0, 169, 224);
        color:black;
    }

    </style>
<section class="hero is-dark is-small">
    <div class="hero-head">
        <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                    <a target="_blank" href="https://www.youtube.com/watch?v=VXWvfrmpapI" class="navbar-item" id="styles">
                        <img src="./images/headphoneavatar.jpg" alt="link logo" style="max-height: 70px;" class="py-2 px-2">
                    </a>
                    <a class="navbar-burger" data-target="nav-links" id="burger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </a>
                </div>

                <div class="navbar-menu current-page" id="nav-links">
                    <div class="navbar-start" id="tabcontent"> 
                        <a class="navbar-item is-info" href="about.html" id="styles">About</a>
                        <a class="navbar-item is-info" href="app.html" id="styles">App</a>
                        <a class="navbar-item is-info" href="documentation.html" id="styles">Documentation</a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</section>

    `;


class MyNav extends HTMLElement{
    constructor(){
        super();
        //1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode:"open"});
        //2 - Clone `template` and append it
        this.shadowRoot.appendChild(template2.content.cloneNode(true));
        //this.titleElement = this.shadowRoot.querySelector("#title-element");
        this.tabs = this.shadowRoot.querySelectorAll(".navbar-menu li");
        this.tabContentBoxes = this.shadowRoot.querySelectorAll("#tabcontent > a");
        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-links");
    }
    static get observedAttributes(){
        return ["data-title"];
    }
    //3 - called when the component is added to the page

    attributeChangedCallback(attributeName, oldVal, newVal){
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    connectedCallback(){
        this.render();
    }
    runTabs(){
        this.tabs.forEach((tab) => {
    //when a tab is clicked, remove 'is-active' marker
    //this allows all tabs to be unclicked when selecting a new tab
            tab.addEventListener('click', () =>{
                this.tabs.forEach(item => item.classList.remove('is-active'))
                //when tab is clicked, activate tab
                tab.classList.add('is-active');
                //new variable for active tab
                const target = tab.dataset.target;
                this.tabContentBoxes.forEach(box =>{
                    //does ID of box cycling through have target.
                    //if it does, remove isHidden class
                    //else, apply the isHidden class

                    if(box.getAttribute('id') === target){
                        box.classList.remove('is-hidden');
                        box.classList.add('is-light');

                    }else{
                        box.classList.add('is-hidden');
                        box.classList.remove('is-light');
                    }
                })
            })
        });
    }
    //4 - a helper method to display the values of the attributes
    render(){
        //diplay burger icon with navbarMenu pages
       this.burgerIcon.addEventListener('click', () => {
            this.navbarMenu.classList.toggle('is-active');
        })

        this.runTabs();
    }
}


customElements.define('navbar-code', MyNav);