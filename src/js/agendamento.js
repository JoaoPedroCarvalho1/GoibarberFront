import { ApiService } from '../mocks/data.js';
import { Calendar } from './calendar.js';

class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedBarber = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.loading = false;

        this.initializeElements();
        this.addEventListeners();
        this.loadInitialData();

        // Inicializa o calendário
        this.calendar = new Calendar('booking-calendar', {
            onDateSelect: (date) => {
                this.handleDateSelect(date);
            }
        });
    }

    initializeElements() {
        // Tabs
        this.tabs = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Steps
        this.steps = document.querySelectorAll('.step');
        this.sections = document.querySelectorAll('.booking-section');
        
        // Navigation
        this.prevBtn = document.querySelector('.btn-prev');
        this.nextBtn = document.querySelector('.btn-next');
        
        // Service Cards
        this.serviceCards = document.querySelectorAll('.service-card');
        this.barberCards = document.querySelectorAll('.barber-card');

    }

    addEventListeners() {
        // Eventos das tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                console.log('Tab clicada:', tab.dataset.tab);
                this.switchTab(tab);
            });
        });

        // Eventos de navegação
        this.prevBtn.addEventListener('click', () => {
            this.navigateStep('prev');
        });

        this.nextBtn.addEventListener('click', () => {
            if (this.currentStep === 4) {
                this.createBooking(); // Chama createBooking se estiver no passo 4
            } else {
                this.navigateStep('next'); // Navega para o próximo passo
            }
        });

        // Eventos de seleção de serviço
        this.serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectService(card);
            });
        });

        // Eventos de seleção de barbeiro
        this.barberCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectBarber(card);
            });
        });

    }

    switchTab(tab) {
        const tabId = tab.dataset.tab;
        console.log('Mudando para tab:', tabId);
        
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.tabContents.forEach(content => {
            content.classList.remove('active');
            const menu = document.getElementById(tabId);
            const isMyBookings = menu.id === "my-bookings";
            const menuUnselectId = isMyBookings ? 'new-booking' : 'my-booking';

            content.classList.toggle('active', content.id === tabId);
            menu.classList.remove('none');
            document.getElementById(menuUnselectId).classList.add('none');
            console.log(menu.id);
        });
    }

    navigateStep(direction) {
        const oldStep = this.currentStep;
        
        if (direction === 'next' && this.currentStep < 4) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            } else {
                // Exibe uma mensagem de aviso se a validação falhar
                this.showWarning('Por favor, selecione antes de continuar.');
                console.log('Validação falhou no passo:', this.currentStep);
                return; // Se a validação falhar, não navegue
            }
        } else if (direction === 'prev' && this.currentStep > 1) {
            this.currentStep--;
        }

        this.updateStepsDisplay(); // Atualiza a exibição após a navegação
    }

    validateCurrentStep() {
        switch(this.currentStep) {
            case 1:
                return this.selectedService !== null;
            case 2:
                return this.selectedBarber !== null;
            case 3:
                return this.selectedDate !== null && this.selectedTime !== null;
            default:
                return true;
        }
    }

    updateStepsDisplay() {
        // Update steps visualization
        this.steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'complete');
            
            if (stepNum === this.currentStep) {
                step.classList.add('active');
            } else if (stepNum < this.currentStep) {
                step.classList.add('complete');
            }
        });

        // Update sections visibility
        this.sections.forEach((section, index) => {
            section.classList.remove('active');
            section.classList.add('none');
            if (index + 1 === this.currentStep) {
                section.classList.add('active');
                section.classList.remove('none');
            }
        });

        // Update navigation buttons
        this.prevBtn.disabled = this.currentStep === 1;
        this.nextBtn.textContent = this.currentStep === 4 ? 'Confirmar' : 'Próximo';
    }

    selectService(card) {
        // If clicking the same card that's already selected, deselect it
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            this.selectedService = null;
        } else {
            // Remove selection from other cards and select the new one
            this.serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            this.selectedService = {
                id: card.dataset.serviceId,
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.dataset.price)
            };
        }

        this.updateSummary();
    }

    selectBarber(card) {
        // If clicking the same card that's already selected, deselect it
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            this.selectedBarber = null;
        } else {
            // Remove selection from other cards and select the new one
            this.barberCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            this.selectedBarber = {
                id: card.dataset.barberId,
                name: card.querySelector('h3').textContent
            };
        }

        this.updateSummary();
    }

    selectTimeSlot(slot) {
        // Remove a seleção de todos os horários
        document.querySelectorAll('.time-slot').forEach(s => 
            s.classList.remove('selected'));
        
        // Adiciona a classe 'selected' ao horário clicado
        slot.classList.add('selected');
        
        // Atualiza o horário selecionado
        this.selectedTime = slot.dataset.time;
        
        // Atualiza o resumo
        this.updateSummary();
    }

    updateSummary() {
        const summary = {
            servico: this.selectedService?.name,
            barbeiro: this.selectedBarber?.name,
            data: this.selectedDate?.toLocaleDateString(),
            horario: this.selectedTime,
            preco: this.selectedService?.price
        };

        // Log the summary for debugging purposes
        // console.log('Resumo do agendamento:', summary);

        // Atualiza os elementos do DOM
        if (this.selectedService) {
            document.getElementById('summary-service').textContent = this.selectedService.name;
            document.getElementById('summary-price').textContent = 
                `R$ ${this.selectedService.price.toFixed(2)}`;
        }
        
        if (this.selectedBarber) {
            document.getElementById('summary-barber').textContent = this.selectedBarber.name;
        }
        
        if (this.selectedDate) {
            document.getElementById('summary-date').textContent = 
                this.selectedDate.toLocaleDateString();
        }
        
        if (this.selectedTime) {
            document.getElementById('summary-time').textContent = this.selectedTime;
        }
    }

    async loadInitialData() {
        try {
            this.setLoading(true);
            
            // Carrega serviços
            const services = await ApiService.getServices();
            this.renderServices(services);
            const barbers = await ApiService.getBarbers();
            this.renderBarbers(barbers);

            // Carrega agendamentos do usuário
            const userBookings = await ApiService.getUserBookings();
            console.log('Agendamentos do usuário carregados:', userBookings);
            this.setLoading(true); // Inicia o loading
            await this.renderUserBookings(userBookings);
            this.setLoading(false); // Finaliza o loading

        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            this.showError('Erro ao carregar dados iniciais');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        // Adiciona/remove classe de loading nos containers
        document.querySelectorAll('.loading-container').forEach(container => {
            container.classList.toggle('loading', isLoading);
        });
    }

    renderServices(services) {
        const container = document.querySelector('.services-grid');
        container.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}" data-price="${service.price}">
                <img src="${service.image}" alt="${service.name}">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-details">
                    <span class="duration"><i class="fas fa-clock"></i> ${service.duration}min</span>
                    <span class="price">R$ ${service.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');

        // Adiciona eventos de clique aos cartões de serviço
        const serviceCards = container.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                if (typeof this.selectService === 'function') {
                    this.selectService(card);
                } else {
                    console.error('selectService não é uma função');
                }
            });
        });
    }

    renderBarbers(barbers) {
        const container = document.querySelector('.barbers-grid');
        container.innerHTML = barbers.map(barber => `
            <div class="barber-card" data-barber-id="${barber.id}">
                <img src="${barber.image}" alt="${barber.name}">
                <h3>${barber.name}</h3>
                <p>${barber.specialty}</p>
                <div class="barber-rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(barber.rating))}</span>
                    <span class="rating-value">${barber.rating}</span>
                </div>
            </div>
        `).join('');

        // Adiciona eventos de clique aos cartões de barbeiro
        const barberCards = container.querySelectorAll('.barber-card');
        barberCards.forEach(card => {
            card.addEventListener('click', () => {
                if (typeof this.selectBarber === 'function') {
                    this.selectBarber(card);
                } else {
                    console.error('selectBarber não é uma função');
                }
            });
        });
    }

    async loadTimeSlots() {
        if (!this.selectedBarber || !this.selectedDate) return;
        try {
            this.setLoading(true);
            const availableSlots = await ApiService.getBarberAvailability(
                this.selectedBarber.id,
                this.selectedDate
            );

            this.renderTimeSlots(availableSlots);
        } catch (error) {
            console.error('Erro ao carregar horários disponíveis:', error);
            this.showError('Erro ao carregar horários disponíveis');
        } finally {
            this.setLoading(false);
        }
    }

    renderTimeSlots(slots) {
        const container = document.querySelector('.slots-grid');
        container.innerHTML = slots.map(time => `
            <div class="time-slot" data-time="${time}">
                ${time}
            </div>
        `).join('');

        // Adiciona eventos de clique aos slots de horário
        container.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                this.selectTimeSlot(slot);
            });
        });
    }

    renderUserBookings(bookings) {
        const container = document.querySelector('.bookings-list');
        container.innerHTML = bookings.map(booking => `
            <div class="booking-item ${booking.status}">
                <div class="booking-info">
                    <h3>${this.getServiceName(booking.serviceId)}</h3>
                    <p>com ${this.getBarberName(booking.barberId)}</p>
                    <p>${new Date(booking.date).toLocaleDateString()} às ${booking.time}</p>
                </div>
                <div class="booking-status">
                    <span class="status-badge">${this.getStatusLabel(booking.status)}</span>
                </div>
                <div class="booking-actions">
                    ${booking.status === 'pending' ? `
                        <button class="btn-cancel" data-booking-id="${booking.id}">Cancelar</button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        this.attachBookingActionListeners();
    }

    async getServiceName(serviceId) {
        const services =  await ApiService.getServices();
        const service = services.find(s => s.id === serviceId)
        return service ? service.name : 'Serviço não encontrado';
    }

    async getBarberName(barberId) {
        const barbers =  await ApiService.getBarbers();
        const barber = barbers.find(s => s.id === barberId)
        return barber ? barber.name : 'Profissional não encontrado';
    }

    getStatusLabel(status) {
        const labels = {
            confirmed: 'Confirmado',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return labels[status] || status;
    }

    async createBooking() {
        console.log('Iniciando criação de agendamento...');
        
        if (!this.validateBookingData()) {
            console.log('Dados de agendamento inválidos');
            return;
        }

        try {
            this.setLoading(true);
            console.log('Dados do agendamento:', {
                serviceId: this.selectedService.id,
                barberId: this.selectedBarber.id,
                date: this.selectedDate,
                time: this.selectedTime,
                price: this.selectedService.price
            });

            const newBooking = await ApiService.createBooking({
                serviceId: this.selectedService.id,
                barberId: this.selectedBarber.id,
                date: this.selectedDate,
                time: this.selectedTime,
                price: this.selectedService.price
            });

            console.log('Agendamento criado com sucesso:', newBooking);
            this.showSuccess('Agendamento realizado com sucesso!');
            this.redirectToCheckout(newBooking.id);
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            this.showError('Erro ao criar agendamento');
        } finally {
            this.setLoading(false);
        }
    }

    validateBookingData() {
        const isValid = !!(this.selectedService && 
                          this.selectedBarber && 
                          this.selectedDate && 
                          this.selectedTime);

        console.log('Validação de dados:', {
            servico: !!this.selectedService,
            barbeiro: !!this.selectedBarber,
            data: !!this.selectedDate,
            horario: !!this.selectedTime,
            valido: isValid
        });

        return isValid;
    }

    showError(message) {
        this.showNotification('error', message);
    }

    showSuccess(message) {
        this.showNotification('success', message);
    }

    showNotification(type, message) {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Cria ícone baseado no tipo
        const icon = document.createElement('i');
        icon.className = type === 'error' 
            ? 'fas fa-exclamation-circle'
            : 'fas fa-check-circle';
        
        // Cria elemento para a mensagem
        const messageElement = document.createElement('span');
        messageElement.textContent = message;

        // Cria botão de fechar
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => notification.remove();

        // Monta a notificação
        notification.appendChild(icon);
        notification.appendChild(messageElement);
        notification.appendChild(closeButton);

        // Adiciona ao DOM
        document.body.appendChild(notification);

        // Adiciona classe para animação
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300); // Tempo da animação
        }, 5000);

        // Loga no console
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    }

    redirectToCheckout(bookingId) {
        // Exemplo de dados da compra
        const purchaseData = {
            serviceId: this.selectedService.id,
            barberId: this.selectedBarber.id,
            date: this.selectedDate.toISOString().split('T')[0],
            time: this.selectedTime,
            price: this.selectedService.price
        };

        // Codificando os dados em base64
        const encodedData = btoa(JSON.stringify(purchaseData));

        // Redirecionando para a página de checkout com os dados na URL
        window.location.href = `checkout.html?data=${encodedData}`;
    }

    handleDateSelect(date) {
        this.selectedDate = date;
        this.loadTimeSlots(); // Carrega horários disponíveis para a data selecionada
    }

    showWarning(message) {
        // Implementa a lógica para mostrar uma mensagem de aviso
        const notification = document.createElement('div');
        notification.className = 'notification warning';
        notification.textContent = message;

        // Adiciona um botão de fechar
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.onclick = () => notification.remove();
        notification.appendChild(closeButton);

        // Adiciona ao DOM
        document.body.appendChild(notification);

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Inicializa o gerenciador quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const bookingManager = new BookingManager();
}); 