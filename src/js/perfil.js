
const usuarioMock = {
    admin: true,
    nome: "João da Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    nascimento: "1990-05-15",
    avatar: "https://i.pravatar.cc/150?img=68" 
};


let isEditMode = false;

function inicializarPerfil() {

    document.getElementById('profile-name').textContent = usuarioMock.nome;
    document.getElementById('display-nome').textContent = usuarioMock.nome;
    document.getElementById('display-email').textContent = usuarioMock.email;
    document.getElementById('display-telefone').textContent = usuarioMock.telefone;
    document.getElementById('display-nascimento').textContent = formatarData(usuarioMock.nascimento);
    document.getElementById('avatar-preview').src = usuarioMock.avatar;


    document.getElementById('edit-nome').value = usuarioMock.nome;
    document.getElementById('edit-email').value = usuarioMock.email;
    document.getElementById('edit-telefone').value = usuarioMock.telefone;
    document.getElementById('edit-nascimento').value = usuarioMock.nascimento;
}


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

function salvarAlteracoes() {

    usuarioMock.nome = document.getElementById('edit-nome').value;
    usuarioMock.email = document.getElementById('edit-email').value;
    usuarioMock.telefone = document.getElementById('edit-telefone').value;
    usuarioMock.nascimento = document.getElementById('edit-nascimento').value;

   
    inicializarPerfil();
    toggleEditMode();

  
    alert('Perfil atualizado com sucesso!');
}

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


function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}


document.addEventListener('DOMContentLoaded', inicializarPerfil); 