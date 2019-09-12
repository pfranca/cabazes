

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Food', [{
    name: 'Açucar',
    quantity: 0,
  }, {
    name: 'Aletria',
    quantity: 0,
  }, {
    name: 'Arroz',
    quantity: 0,
  }, {
    name: 'Azeite',
    quantity: 0,
  }, {
    name: 'Bolachas (pack 4)',
    quantity: 0,
  }, {
    name: 'Atum',
    quantity: 0,
  }, {
    name: 'Salsichas',
    quantity: 0,
  }, {
    name: 'Leguminosas',
    quantity: 0,
  }, {
    name: 'Leite',
    quantity: 0,
  }, {
    name: 'Massa',
    quantity: 0,
  }, {
    name: 'Cereais',
    quantity: 0,
  }, {
    name: 'Papas',
    quantity: 0,
  }, {
    name: 'Óleo',
    quantity: 0,
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Food', null, {}),
};
