// Dados mockados do usuário
const usuarioMock = {
    nome: "João da Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    nascimento: "1990-05-15",
    avatar: "https://i.pravatar.cc/150?img=68" // Avatar aleatório para teste
};

// Elementos do DOM
let isEditMode = false;

// Inicializar dados do perfil
function inicializarPerfil() {
    // Preencher dados no modo visualização
    document.getElementById('profile-name').textContent = usuarioMock.nome;
    document.getElementById('display-nome').textContent = usuarioMock.nome;
    document.getElementById('display-email').textContent = usuarioMock.email;
    document.getElementById('display-telefone').textContent = usuarioMock.telefone;
    document.getElementById('display-nascimento').textContent = formatarData(usuarioMock.nascimento);
    document.getElementById('avatar-preview').src = usuarioMock.avatar;

    // Preencher dados no modo edição
    document.getElementById('edit-nome').value = usuarioMock.nome;
    document.getElementById('edit-email').value = usuarioMock.email;
    document.getElementById('edit-telefone').value = usuarioMock.telefone;
    document.getElementById('edit-nascimento').value = usuarioMock.nascimento;
}

// Alternar entre modo de visualização e edição
function toggleEditMode() {
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
    } else {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
    }
}

// Salvar alterações do perfil
function salvarAlteracoes() {
    // Atualizar objeto mock com novos valores
    usuarioMock.nome = document.getElementById('edit-nome').value;
    usuarioMock.email = document.getElementById('edit-email').value;
    usuarioMock.telefone = document.getElementById('edit-telefone').value;
    usuarioMock.nascimento = document.getElementById('edit-nascimento').value;

    // Atualizar a visualização
    inicializarPerfil();
    toggleEditMode();

    // Feedback para o usuário
    alert('Perfil atualizado com sucesso!');
}

// Manipular upload de avatar
document.getElementById('avatar-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').src = e.target.result;
            usuarioMock.avatar = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Função auxiliar para formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Inicializar perfil quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarPerfil); 