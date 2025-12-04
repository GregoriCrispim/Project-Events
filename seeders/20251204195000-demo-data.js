module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Eventos', [
      {
        nome: 'Congresso de Tecnologia',
        descricao: 'Evento sobre inovação e tecnologia.',
        data_inicio: new Date('2025-06-10'),
        data_fim: new Date('2025-06-12'),
        local: 'Centro de Convenções',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Semana Acadêmica',
        descricao: 'Atividades acadêmicas e palestras.',
        data_inicio: new Date('2025-08-01'),
        data_fim: new Date('2025-08-05'),
        local: 'Universidade Federal',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Participantes', [
      {
        nome: 'Ana Silva',
        email: 'ana@email.com',
        celular: '11999999999',
        tipo: 'estudante',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Carlos Souza',
        email: 'carlos@email.com',
        celular: '11988888888',
        tipo: 'palestrante',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Atividades', [
      {
        titulo: 'Workshop de IA',
        descricao: 'Introdução à Inteligência Artificial.',
        horario_inicio: new Date('2025-06-10T09:00:00'),
        horario_fim: new Date('2025-06-10T12:00:00'),
        tipo: 'workshop',
        EventoId: 1,
        ResponsavelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        titulo: 'Palestra sobre Cloud',
        descricao: 'Tendências em computação em nuvem.',
        horario_inicio: new Date('2025-06-11T14:00:00'),
        horario_fim: new Date('2025-06-11T16:00:00'),
        tipo: 'palestra',
        EventoId: 1,
        ResponsavelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('EventoParticipantes', [
      {
        EventoId: 1,
        ParticipanteId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        EventoId: 1,
        ParticipanteId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EventoParticipantes', null, {});
    await queryInterface.bulkDelete('Atividades', null, {});
    await queryInterface.bulkDelete('Participantes', null, {});
    await queryInterface.bulkDelete('Eventos', null, {});
  }
};
