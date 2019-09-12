const bcrypt = require('bcryptjs');

const hash = function () {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync('teste', salt);
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [
    {
      username: 'admin',
      role: 'admin',
      password: hash(),
      email: 'admin@teste.com',
    },
    {
      username: 'user',
      role: 'user',
      password: hash(),
      email: 'user@teste.com',
    },
    {
      username: 'viewer',
      role: 'viewer',
      password: hash(),
      email: 'viewer@teste.com',
    },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
