class Header extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header class="header desktop">
                <nav class="nav-container">
                    <div class="logo">
                        <a href="/GoibarberFront/home.html">
                            <img src="./src/logo-goiaba.png" alt="Goiabarber Logo">
                        </a>
                    </div>
                    <div class="user-actions">
                        
                        <a href="/GoibarberFront/index.html"class="btn-login">Entrar</a>
                        <a href="/GoibarberFront/criarConta.html" class="btn-register">Criar Conta</a>
                    </div>
                </nav>
            </header>

            <header class="header mobile">
                <nav class="nav-container nav-container-mobile ">
                    <div class="logo">
                        <a href="/GoibarberFront/home.html">
                            <img src="./src/logo-goiaba.png" alt="Goiabarber Logo">
                        </a>
                    </div>
                    <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                    </span>                    
                </nav>
            </header>            
        `;
    }
}

customElements.define('app-header', Header);

class MobileHeader {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const hamburger = document.querySelector('.hamburger-box');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('is-active');
                mobileMenu.classList.toggle('is-active');
                mobileMenu.classList.toggle('menu-open');
            });

            // Fecha o menu ao clicar em um link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('is-active');
                    mobileMenu.classList.remove('is-active');
                    mobileMenu.classList.remove('menu-open');
                });
            });
        }
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new MobileHeader();
}); 