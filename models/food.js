

module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
  }, {
    indexes: [
      { type: 'FULLTEXT', name: 'name_txt_index', fields: ['name'] },
    ],
  });
  Food.associate = function (models) {
    // associations can be defined here
  };
  return Food;
};
