module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    'Person',
    {
      name: DataTypes.STRING,
      dataNascimento: DataTypes.DATEONLY,
      faixaEtaria: DataTypes.STRING,
      escolaridade: DataTypes.INTEGER,
      doencaBool: DataTypes.BOOLEAN,
      doencaString: DataTypes.STRING,
      rendimentos: DataTypes.INTEGER,
      deficiente: DataTypes.BOOLEAN,
      outros: DataTypes.BOOLEAN,
      familyId: DataTypes.INTEGER,
    },
    {},
  );
  Person.associate = function (models) {
    /* triggers family updates to calculate new score */
    Person.addHook('afterSave', async (person) => {
      const family = await models.Family.findByPk(person.familyId);
      return family.save();
    });

    // associations can be defined here
    Person.belongsTo(models.Family, {
      onDelete: 'CASCADE',
      foreignKey: 'familyId',
    });
  };
  return Person;
};
