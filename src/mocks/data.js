// Mock de dados que seriam vindos da API
const MOCK_DATA = {
    services: [
        {
            id: 1,
            name: "Corte de Cabelo",
            description: "Corte profissional personalizado",
            duration: 45,
            price: 45.00,
            image: "https://static.wixstatic.com/media/4c82981e961041ae9b1a50b5895e47ae.jpg/v1/fill/w_1899,h_906,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4c82981e961041ae9b1a50b5895e47ae.jpg"
        },
        {
            id: 2,
            name: "Barba",
            description: "Modelagem completa com produtos premium",
            duration: 30,
            price: 35.00,
            image: "https://static.wixstatic.com/media/4c82981e961041ae9b1a50b5895e47ae.jpg/v1/fill/w_1899,h_906,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4c82981e961041ae9b1a50b5895e47ae.jpg"
        },
        {
            id: 3,
            name: "Combo Completo",
            description: "Corte + Barba com atendimento premium",
            duration: 75,
            price: 70.00,
            image: "https://static.wixstatic.com/media/4c82981e961041ae9b1a50b5895e47ae.jpg/v1/fill/w_1899,h_906,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4c82981e961041ae9b1a50b5895e47ae.jpg"
        }
    ],
    
    barbers: [
        {
            id: 1,
            name: "João Silva",
            specialty: "Especialista em Degradê",
            image: "https://static.wixstatic.com/media/4c82981e961041ae9b1a50b5895e47ae.jpg/v1/fill/w_1899,h_906,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4c82981e961041ae9b1a50b5895e47ae.jpg",
            rating: 4.8,
            availableDays: [1, 2, 3, 4, 5] // Segunda a Sexta
        },
        {
            id: 2,
            name: "Pedro Santos",
            specialty: "Barbeiro Master",
            image: "../barbearia.jpg",
            rating: 4.9,
            availableDays: [1, 2, 3, 4, 5, 6] // Segunda a Sábado
        },
        {
            id: 3,
            name: "Carlos Oliveira",
            specialty: "Expert em Barba",
            image: "../barbearia.jpg",
            rating: 4.7,
            availableDays: [2, 3, 4, 5, 6] // Terça a Sábado
        }
    ],

    timeSlots: {
        morning: ["09:00", "10:00", "11:00"],
        afternoon: ["14:00", "15:00", "16:00", "17:00", "18:00"]
    },

    // Mock de agendamentos do usuário logado
    userBookings: [
        {
            id: 1,
            serviceId: 1,
            barberId: 2,
            date: "2024-03-20",
            time: "14:00",
            status: "confirmed",
            price: 45.00
        },
        {
            id: 2,
            serviceId: 3,
            barberId: 1,
            date: "2024-03-25",
            time: "10:00",
            status: "pending",
            price: 70.00
        }
    ]
};

// Simulação de chamadas à API
class ApiService {
    static async getServices() {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_DATA.services;
    }

    static async getBarbers() {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_DATA.barbers;
    }

    static async getBarberAvailability(barberId, date) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const barber = MOCK_DATA.barbers.find(b => b.id === barberId);
        const dayOfWeek = new Date(date).getDay();
        
        if (!barber.availableDays.includes(dayOfWeek)) {
            return [];
        }

        return [...MOCK_DATA.timeSlots.morning, ...MOCK_DATA.timeSlots.afternoon];
    }

    static async getUserBookings() {
        await new Promise(resolve => setTimeout(resolve, 400));
        return MOCK_DATA.userBookings;
    }

    static async createBooking(bookingData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        // Simula criação de agendamento
        const newBooking = {
            id: Math.floor(Math.random() * 1000),
            ...bookingData,
            status: "pending"
        };
        return newBooking;
    }
}

export { ApiService }; 