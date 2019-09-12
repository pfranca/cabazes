
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventName: DataTypes.STRING,
    hasEnded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    finishedAt: DataTypes.DATE,
  }, {
    indexes: [
      { type: 'FULLTEXT', name: 'name_txt_index', fields: ['eventName'] },
    ],
  });

  Event.associate = (models) => {
    // associations can be defined here
    Event.hasMany(models.Delivery);
  };
  return Event;
};
