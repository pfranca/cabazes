const models = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => models.Person.bulkCreate(
    [
      {
        name: 'Rui Santos',
        idade: 79,
        doencaBool: true,
        doencaString: 'Manca de uma perna',
        rendimentos: 360,
        deficiente: true,
        outros: false,
        familyId: 1,
      },
      {
        name: 'Maria Santos',
        idade: 75,
        doencaBool: true,
        doencaString: 'Demencia',
        rendimentos: 250,
        deficiente: false,
        outros: true,
        familyId: 1,
      },
      {
        name: 'José João Silva',
        idade: 50,
        escolaridade: 0,
        doencaBool: false,
        rendimentos: 680,
        deficiente: false,
        outros: false,
        familyId: 2,
      },
      {
        name: 'Manuela dos Anjos Silva',
        idade: 43,
        escolaridade: 0,
        doencaBool: false,
        rendimentos: 500,
        deficiente: false,
        outros: false,
        familyId: 2,
      },
      {
        name: 'Mariana Silva',
        idade: 8,
        escolaridade: 2,
        doencaBool: false,
        deficiente: false,
        outros: false,
        familyId: 2,
      },
      {
        name: 'Diogo Silva',
        idade: 17,
        escolaridade: 10,
        doencaBool: false,
        deficiente: false,
        outros: false,
        familyId: 2,
      },
      {
        name: 'Miguel Silva',
        idade: 21,
        doencaBool: false,
        deficiente: true,
        outros: true,
        familyId: 2,
      },
      {
        name: 'Ana Sousa',
        idade: 49,
        doencaBool: true,
        doencaString: 'esclorose multipla',
        deficiente: false,
        rendimentos: 580,
        familyId: 3,
      },
      {
        name: 'João Sousa',
        idade: 10,
        escolaridade: 5,
        doencaBool: false,
        deficiente: false,
        outros: false,
        familyId: 3,
      },
      {
        name: 'Elisa Sousa',
        idade: 7,
        escolaridade: 3,
        doencaBool: false,
        deficiente: false,
        outros: false,
        familyId: 3,
      },
    ],
    { individualHooks: true },
  ),
  down: (queryInterface, Sequelize) => models.Person.dropTable(),
};
