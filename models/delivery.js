
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    done: DataTypes.BOOLEAN,
    deliveredAt: DataTypes.DATE,
    eventId: DataTypes.INTEGER,
    familyId: DataTypes.INTEGER,
    familyName: DataTypes.STRING,
    deliveredGoods: DataTypes.STRING,
  }, {});
  Delivery.associate = function (models) {
    Delivery.belongsTo(models.Event, {
      onDelete: 'CASCADE',
      foreignKey: 'eventId',
    });
    Delivery.belongsTo(models.Family, {
      onDelete: 'CASCADE',
      foreignKey: 'familyId',
    });
  };
  return Delivery;
};
