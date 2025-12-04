// ...existing code...
module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    nome: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    data_inicio: DataTypes.DATE,
    data_fim: DataTypes.DATE,
    local: DataTypes.STRING
  }, {});
  Evento.associate = function(models) {
    Evento.hasMany(models.Atividade, { foreignKey: 'EventoId' });
    Evento.belongsToMany(models.Participante, {
      through: models.EventoParticipante,
      foreignKey: 'EventoId',
      otherKey: 'ParticipanteId'
    });
  };
  return Evento;
};
// ...existing code...
