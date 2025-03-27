import { ApiService } from '../mocks/data.js';

class BarbersCarousel {
    constructor() {
        this.currentPosition = 0;
        this.init();
    }

    async init() {
        await this.loadBarbers();
        this.setupControls();
    }

    async loadBarbers() {
        try {
            const barbers = await ApiService.getBarbers();
            this.renderBarbers(barbers);
        } catch (error) {
            console.error('Erro ao carregar barbeiros:', error);
        }
    }

    renderBarbers(barbers) {
        const track = document.querySelector('.barbers-track');
        if (!track) return;

        track.innerHTML = '';

        barbers.forEach(barber => {
            const card = this.createBarberCard(barber);
            track.appendChild(card);
        });
    }

    createBarberCard(barber) {
        const card = document.createElement('div');
        card.className = 'barber-card';
        card.setAttribute('data-barber-id', barber.id);

        card.innerHTML = `
            <img src="${barber.image}" alt="${barber.name}" onerror="this.src='src/assets/images/default-barber.jpg'">
            <h3>${barber.name}</h3>
            <p>${barber.specialty}</p>
            <div class="barber-rating">
                <span class="stars">${this.getStarRating(barber.rating)}</span>
                <span class="rating-value">${barber.rating.toFixed(1)}</span>
            </div>
            <div class="barber-availability">
                <p>Disponível:</p>
                <div class="days">
                    ${this.renderAvailableDays(barber.availableDays)}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `agendamento.html?barberId=${barber.id}`;
        });

        return card;
    }

    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        // Estrelas cheias
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }

        // Meia estrela
        if (hasHalfStar) {
            stars += '⯨';
        }

        // Estrelas vazias
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }

        return stars;
    }

    renderAvailableDays(days) {
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days.map(dayNumber => `
            <span class="day-badge">${dayNames[dayNumber]}</span>
        `).join('');
    }

    setupControls() {
        const prevButton = document.querySelector('.barbers-button.prev');
        const nextButton = document.querySelector('.barbers-button.next');
        const track = document.querySelector('.barbers-track');

        if (!prevButton || !nextButton || !track) return;

        prevButton.addEventListener('click', () => this.slide('prev'));
        nextButton.addEventListener('click', () => this.slide('next'));

        // Adiciona controles de touch para mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                this.slide('next');
            } else if (touchEndX - touchStartX > 50) {
                this.slide('prev');
            }
        });
    }

    slide(direction) {
        const track = document.querySelector('.barbers-track');
        const cards = track.querySelectorAll('.barber-card');
        const cardWidth = cards[0].offsetWidth + 20; // 20px de margem

        if (direction === 'next' && this.currentPosition > -(cards.length - 1)) {
            this.currentPosition--;
        } else if (direction === 'prev' && this.currentPosition < 0) {
            this.currentPosition++;
        }

        track.style.transform = `translateX(${this.currentPosition * cardWidth}px)`;
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new BarbersCarousel();
}); 