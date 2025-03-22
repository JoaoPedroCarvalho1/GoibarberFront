// Função para decodificar os dados da URL
function getPurchaseDetails() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data'); // Supondo que os dados estão na URL como ?data=base64string
    if (data) {
        const decodedData = JSON.parse(atob(data)); // Decodifica a string base64 e converte de volta para objeto
        displayPurchaseDetails(decodedData); // Chama a função para exibir os dados
        handlePaymentMethod(decodedData.paymentMethod); // Chama a função para lidar com o método de pagamento
    }
}

// Função para exibir os dados da compra
function displayPurchaseDetails(details) {
    console.log(details)
    const detailsDiv = document.getElementById('purchase-details');
    detailsDiv.innerHTML = `
        <h1>Detalhes da Compra</h1>
        <h2>Preço: R$ ${details.price.toFixed(2)}</h2>
        <table>
            <thead>
                <tr>
                    <th>DADO</th>
                    <th>Por</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Serviço</td>
                    <td>${details.service}</td>
                </tr>
                <tr>
                    <td>Barbeiro</td>
                    <td>${details.barber}</td>
                </tr>
                <tr>
                    <td>Data</td>
                    <td>${details.time}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Função para lidar com o método de pagamento
function handlePaymentMethod(paymentMethod) {
    if (paymentMethod === 'credit_card') {
        // Exibir formulário para dados do cartão de crédito
        displayCreditCardForm();
    } else if (paymentMethod === 'pix') {
        // Exibir QR code para pagamento via Pix
        displayQRCode();
    }
}

// Função para exibir o formulário do cartão de crédito
function displayCreditCardForm() {
    const formDiv = document.getElementById('credit-card-form');
    formDiv.innerHTML = `
        <h3>Dados do Cartão de Crédito</h3>
        <input type="text" id="card-number" placeholder="Número do Cartão" required />
        <input type="text" id="card-holder" placeholder="Nome do Titular" required />
        <input type="text" id="expiry-date" placeholder="Data de Validade (MM/AA)" required />
        <input type="text" id="cvv" placeholder="CVV" required />
        <button onclick="validateCreditCard()">Pagar</button>
    `;
}

// Função para validar os dados do cartão de crédito
function validateCreditCard() {
    // Lógica de validação dos dados do cartão
    const cardNumber = document.getElementById('card-number').value;
    const cardHolder = document.getElementById('card-holder').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    // Exemplo de validação simples
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert('Por favor, preencha todos os campos do cartão.');
        return;
    }
    // Aqui você pode adicionar mais validações conforme necessário
    alert('Dados do cartão validados com sucesso!');
}

// Função para exibir o QR code
function displayQRCode() {
    const qrCodeDiv = document.getElementById('qr-code');
    qrCodeDiv.innerHTML = `
        <h3>Pagamento via Pix</h3>
        <img src="link-para-o-qrcode-aqui" alt="QR Code para pagamento" />
    `;
}

// Chama a função ao carregar a página
window.onload = getPurchaseDetails;