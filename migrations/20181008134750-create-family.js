module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Families', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    nomeChefe: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    morada: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    telefone: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    rsiBool: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    rsiInt: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    habSocial: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    cabazMensal: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    escalao: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    outroSubsidio: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    despHabitacao: {
      type: Sequelize.INTEGER,
    },
    despMedicacao: {
      type: Sequelize.INTEGER,
    },
    despOutros: {
      type: Sequelize.INTEGER,
    },
    necessidadeEsp: {
      type: Sequelize.STRING,
    },
    habiMauEstado: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    disable: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    score: {
 
      type: Sequelize.FLOAT,
    },
    needs: {
      type: Sequelize.STRING,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Families'),
};
