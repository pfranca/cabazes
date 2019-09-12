

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Events', [{
    eventName: 'Natal 2018',
    hasEnded: 1,
    createdAt: '2018-12-04 06:15:00',
    finishedAt: '2018-12-06 14:16:00',
  },
  {
    eventName: 'Halloween 2018',
    hasEnded: 1,
    createdAt: '2018-11-05 14:12:00',
    finishedAt: '2018-12-02 09:29:07',
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Event', null, {}),
};
