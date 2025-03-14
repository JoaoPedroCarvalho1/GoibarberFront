import { ApiService } from '../mocks/data.js';
import Calendar from './calendar.js';

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
            onDateSelect: (date) => this.handleDateSelect(date),
            disabledDays: [0], // Domingo
            maxDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
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
        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Navigation
        this.prevBtn.addEventListener('click', () => this.navigateStep('prev'));
        this.nextBtn.addEventListener('click', () => this.navigateStep('next'));

        // Service selection
        this.serviceCards.forEach(card => {
            card.addEventListener('click', () => this.selectService(card));
        });

        // Barber selection
        this.barberCards.forEach(card => {
            card.addEventListener('click', () => this.selectBarber(card));
        });
    }

    switchTab(tab) {
        const tabId = tab.dataset.tab;
        
        // Update active tab
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }

    navigateStep(direction) {
        if (direction === 'next' && this.currentStep < 4) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
            }
        } else if (direction === 'prev' && this.currentStep > 1) {
            this.currentStep--;
        }

        this.updateStepsDisplay();
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
            if (index + 1 === this.currentStep) {
                section.classList.add('active');
            }
        });

        // Update navigation buttons
        this.prevBtn.disabled = this.currentStep === 1;
        this.nextBtn.textContent = this.currentStep === 4 ? 'Confirmar' : 'Próximo';
    }

    selectService(card) {
        this.serviceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedService = {
            id: parseInt(card.dataset.serviceId),
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.dataset.price)
        };
        this.updateSummary();
    }

    selectBarber(card) {
        this.barberCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedBarber = {
            id: parseInt(card.dataset.barberId),
            name: card.querySelector('h3').textContent
        };
        this.updateSummary();
    }

    updateSummary() {
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

            // Carrega agendamentos do usuário
            const userBookings = await ApiService.getUserBookings();
            this.renderUserBookings(userBookings);

        } catch (error) {
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

        // Reattach event listeners
        this.attachServiceListeners();
    }

    async loadBarbers() {
        try {
            this.setLoading(true);
            const barbers = await ApiService.getBarbers();
            this.renderBarbers(barbers);
        } catch (error) {
            this.showError('Erro ao carregar profissionais');
        } finally {
            this.setLoading(false);
        }
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

        this.attachBarberListeners();
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

        this.attachTimeSlotListeners();
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

    getServiceName(serviceId) {
        const service = MOCK_DATA.services.find(s => s.id === serviceId);
        return service ? service.name : 'Serviço não encontrado';
    }

    getBarberName(barberId) {
        const barber = MOCK_DATA.barbers.find(b => b.id === barberId);
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
        if (!this.validateBookingData()) return;

        try {
            this.setLoading(true);
            const bookingData = {
                serviceId: this.selectedService.id,
                barberId: this.selectedBarber.id,
                date: this.selectedDate,
                time: this.selectedTime,
                price: this.selectedService.price
            };

            const newBooking = await ApiService.createBooking(bookingData);
            this.showSuccess('Agendamento realizado com sucesso!');
            // Redireciona para checkout ou atualiza lista de agendamentos
            this.redirectToCheckout(newBooking.id);
        } catch (error) {
            this.showError('Erro ao criar agendamento');
        } finally {
            this.setLoading(false);
        }
    }

    showError(message) {
        // Implementar lógica de exibição de erro
        console.error(message);
    }

    showSuccess(message) {
        // Implementar lógica de exibição de sucesso
        console.log(message);
    }

    redirectToCheckout(bookingId) {
        // Implementar redirecionamento para checkout
        window.location.href = `/checkout.html?booking=${bookingId}`;
    }

    handleDateSelect(date) {
        this.selectedDate = date;
        this.loadTimeSlots(); // Carrega horários disponíveis para a data selecionada
    }
}

// Inicializa o gerenciador quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const bookingManager = new BookingManager();
}); 