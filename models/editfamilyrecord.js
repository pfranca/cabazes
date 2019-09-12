module.exports = (sequelize, DataTypes) => {
  const EditFamilyRecord = sequelize.define('EditFamilyRecord', {
    date: DataTypes.STRING,
    changedFields: DataTypes.STRING,
    comment: DataTypes.STRING,
    familyId: DataTypes.UUID,
  }, {});
  EditFamilyRecord.associate = function (models) {
    // associations can be defined here
    EditFamilyRecord.belongsTo(models.Family, {
      onDelete: 'CASCADE',
      foreignKey: 'familyId',
    });
  };
  return EditFamilyRecord;
};
