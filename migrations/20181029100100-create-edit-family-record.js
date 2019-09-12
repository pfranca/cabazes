
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('EditFamilyRecords', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.STRING,
    },
    changedFields: {
      type: Sequelize.STRING,
    },
    comment: {
      type: Sequelize.STRING,
    },
    familyId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Families',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('EditFamilyRecords'),
};
