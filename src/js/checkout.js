// Função para decodificar os dados da URL
function getPurchaseDetails() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data'); // Supondo que os dados estão na URL como ?data=base64string
    if (data) {
        const decodedData = JSON.parse(atob(data)); // Decodifica a string base64 e converte de volta para objeto
        displayPurchaseDetails(decodedData); // Chama a função para exibir os dados
    }
}

// Função para exibir os dados da compra
function displayPurchaseDetails(details) {
    const detailsDiv = document.getElementById('booking-summary');
    const totalRow = document.getElementById('total-row');
    const installments = document.getElementById('installments');

    detailsDiv.innerHTML = `
        <h2><i class="fas fa-calendar-check"></i> Resumo do Agendamento</h2>
                <div class="summary-card">
                    <div class="summary-item">
                        <i class="fas fa-cut"></i>
                        <div class="item-details">
                            <label>Serviço</label>
                            <span id="service-name">${details.service}</span>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-user-tie"></i>
                        <div class="item-details">
                            <label>Profissional</label>
                            <span id="barber-name">${details.barber}</span>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="far fa-calendar-alt"></i>
                        <div class="item-details">
                            <label>Data</label>
                            <span id="booking-date">${details.date}</span>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="far fa-clock"></i>
                        <div class="item-details">
                            <label>Horário</label>
                            <span id="booking-time">${details.time}</span>
                        </div>
                    </div>
                </div>
    `;
    totalRow.innerHTML = `
        <span>Total</span>
        <span>R$ ${details.price}</span>
    `;
    updateInstallmentOptions(details);
}

// Arredonda para 2 casas decimais
function formatPrice(value) {
    return (Math.round(value * 100) / 100).toFixed(2);
}

// Atualiza as opções de parcelamento
function updateInstallmentOptions(details) {
    const installmentSelect = document.getElementById('installments');
    installmentSelect.innerHTML = `
        <select>
            <option>1x de R$ ${formatPrice(details.price)}</option>
            <option>2x de R$ ${formatPrice(details.price / 2)}</option>
            <option>3x de R$ ${formatPrice(details.price / 3)}</option>
        </select>
    `;
}

const moneySection = document.getElementById('moneySection');
const pixSection = document.getElementById('pixSection');
const creditCardForm = document.getElementById('credit-card-form');

document.getElementById('credit-card').addEventListener('click', () => {
    moneySection.style.display = 'none';
    pixSection.style.display = 'none';
    creditCardForm.style.display = 'block';
});
document.getElementById('pix').addEventListener('click', () => {
    creditCardForm.style.display = 'none';
    moneySection.style.display = 'none';
    pixSection.style.display = 'block';
});
document.getElementById('money').addEventListener('click', () => {
    creditCardForm.style.display = 'none';
    pixSection.style.display = 'none';
    moneySection.style.display = 'block';
});


// Chama a função ao carregar a página
window.onload = getPurchaseDetails;