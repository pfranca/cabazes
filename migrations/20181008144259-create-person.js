
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('People', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idade: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    escolaridade: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    doencaBool: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    doencaString: {
      type: Sequelize.STRING,
    },
    deficiente: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    outros: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    rendimentos: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('People'),
};
