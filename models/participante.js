// ...existing code...
module.exports = (sequelize, DataTypes) => {
  const Participante = sequelize.define('Participante', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    celular: DataTypes.STRING,
    tipo: DataTypes.STRING
  }, {});
  Participante.associate = function(models) {
    Participante.belongsToMany(models.Evento, {
      through: models.EventoParticipante,
      foreignKey: 'ParticipanteId',
      otherKey: 'EventoId'
    });
    Participante.hasMany(models.Atividade, {
      foreignKey: 'ResponsavelId',
      as: 'atividadesResponsavel'
    });
  };
  return Participante;
};
// ...existing code...
