
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Deliveries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    done: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    eventId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id',
      },
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
    familyName: {
      type: Sequelize.STRING,
    },
    deliveredGoods: {
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
    deliveredAt: {
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Deliveries'),
};
