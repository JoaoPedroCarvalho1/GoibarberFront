class Header extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <header class="header">
                <nav class="nav-container">
                    <div class="logo">
                        <a href="/goiabarber/home.html">
                            <img src="./src/logo-goiaba.png" alt="Goiabarber Logo">
                        </a>
                    </div>
                    <ul class="nav-links">
                        <li><a href="/goiabarber/home.html">Home</a></li>
                        <li><a href="/goiabarber/servicos.html">Serviços</a></li>
                        <li><a href="/goiabarber/agendamento.html">Agendamento</a></li>
                        <li><a href="/perfil.html">Perfil</a></li>
                    </ul>
                    <div class="user-actions">
                        <button class="btn-login">Entrar</button>
                        <a href="/criarConta.html" class="btn-register">Criar Conta</a>
                    </div>
                </nav>
            </header>
        `;
    }
}

customElements.define('app-header', Header); 