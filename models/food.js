

module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
  });
  Food.associate = function (models) {
    // associations can be defined here
  };
  return Food;
};
