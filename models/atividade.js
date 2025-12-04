// ...existing code...
module.exports = (sequelize, DataTypes) => {
  const Atividade = sequelize.define('Atividade', {
    titulo: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    horario_inicio: DataTypes.DATE,
    horario_fim: DataTypes.DATE,
    tipo: DataTypes.STRING
  }, {});
  Atividade.associate = function(models) {
    Atividade.belongsTo(models.Evento, { foreignKey: 'EventoId' });
    Atividade.belongsTo(models.Participante, { foreignKey: 'ResponsavelId', as: 'responsavel' });
  };
  return Atividade;
};
// ...existing code...
