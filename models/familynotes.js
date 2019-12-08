
module.exports = (sequelize, DataTypes) => {
  const FamilyNotes = sequelize.define('FamilyNotes', {
    note: DataTypes.STRING,
    familyId: DataTypes.INTEGER,
  }, {});
  FamilyNotes.associate = (models) => {
    // associations can be defined here
    FamilyNotes.belongsTo(models.Family, {
      onDelete: 'CASCADE',
      foreignKey: 'familyId',
    });
  };
  return FamilyNotes;
};
