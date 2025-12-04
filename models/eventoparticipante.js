// ...existing code...
module.exports = (sequelize, DataTypes) => {
  const EventoParticipante = sequelize.define('EventoParticipante', {
    EventoId: DataTypes.INTEGER,
    ParticipanteId: DataTypes.INTEGER
  }, {});
  EventoParticipante.associate = function(models) {
    // Associação N:N já definida nos outros modelos
  };
  return EventoParticipante;
};
// ...existing code...
