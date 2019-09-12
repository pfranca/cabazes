
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Events', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    hasEnded: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    eventName: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    finishedAt: {
      type: Sequelize.DATE,
    },

  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Events'),
};
