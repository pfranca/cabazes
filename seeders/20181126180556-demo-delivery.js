

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Deliveries', [{
    done: true,
    eventId: 1,
    familyId: 1,
  },
  {
    done: false,
    eventId: 1,
    familyId: 2,
  },
  {
    done: false,
    eventId: 2,
    familyId: 1,
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Delivery', null, {}),
};
