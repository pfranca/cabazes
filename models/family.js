// TODO: Nome chefe deve existir? Rsi deve existir?

const createEditFamilyRecord = async (family, models) => {
  const d = new Date().toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let changedString = '';

  Object.keys(family._changed).forEach((index) => {
    const oldValue = family._previousDataValues[index];
    const newValue = family[index];

    changedString += `${index} : ${oldValue} -> ${newValue} | `;
  });

  return models.EditFamilyRecord.create({
    date: d,
    changedFields: changedString,
    comment: family.editComment,
    familyId: family.id,
  });
};

const calculateScore = async (family, models) => {
  let score = 1;

  const needs = {
    acucar: 1,
    aletria: 1,
    arroz: 1,
    azeite: 1,
    bolachas: 1,
    atum: 1,
    salsichas: 1,
    leguminosas: 1,
    leite: 1,
    massa: 1,
    cereais: 0,
    papas: 0,
    oleo: 1,
  };

  const people = await family.getPeople();

  people.forEach((famMember) => {
    if (
      famMember.idade >= 18
      && famMember.idade < 65
      && !famMember.doencaBool
      && !famMember.deficiente
    ) score += 0.5;
    if (famMember.idade >= 18 && famMember.idade < 65 && famMember.deficiente) {
      score += 0.75;
      needs.papas += 1;
    }
    if (famMember.idade >= 65) {
      score += 0.55;
      needs.papas += 1;
    }
    if (famMember.idade > 12 && famMember.idade < 18) {
      score += 0.5;
      needs.cereais += 1;
    }
    if (famMember.idade <= 12) {
      score += 0.75;
      needs.cereais += 1;
      needs.papas += 1;
    }
    if (famMember.idade < 18 && famMember.deficiente) {
      score += 1;
      needs.papas += 1;
    }
    if (famMember.rendimentos < 100) score += 0.15;
    if (famMember.doencaBool) score += 0.25;
    if (famMember.outros) score += 0.1;
  });

  if (family.habiMauEstado) score += 0.1;

  //
  // needs.arroz = Math.floor(2.3 * score);
  // needs.bolachas = Math.floor(1.2 * score);
  // needs.atum = Math.floor(2.4 * score);
  // needs.salsichas = Math.floor(1.2 * score);
  // needs.leguminosas = Math.floor(1.25 * score);
  // needs.leite = Math.round((5 * score) / 6) * 6;
  // needs.massa = Math.floor(3.6 * score);
  // needs.oleo = Math.floor(0.65 * score);
  // needs.cereais = Math.floor(needs.cereais);
  // needs.papas = Math.floor(needs.papas);


  return score.toFixed(2);
};

const calculateNeeds = async (family, models) => {
  let score = 1;

  const needs = {
    acucar: 1,
    aletria: 1,
    arroz: 1,
    azeite: 1,
    bolachas: 1,
    atum: 1,
    salsichas: 1,
    leguminosas: 1,
    leite: 1,
    massa: 1,
    cereais: 0,
    papas: 0,
    oleo: 1,
  };

  const people = await family.getPeople();

  people.forEach((famMember) => {
    if (
      famMember.idade >= 18
      && famMember.idade < 65
      && !famMember.doencaBool
      && !famMember.deficiente
    ) score += 0.5;
    if (famMember.idade >= 18 && famMember.idade < 65 && famMember.deficiente) {
      score += 0.75;
      needs.papas += 1;
    }
    if (famMember.idade >= 65) {
      score += 0.55;
      needs.papas += 1;
    }
    if (famMember.idade > 12 && famMember.idade < 18) {
      score += 0.5;
      needs.cereais += 1;
    }
    if (famMember.idade <= 12) {
      score += 0.75;
      needs.cereais += 1;
      needs.papas += 1;
    }
    if (famMember.idade < 18 && famMember.deficiente) {
      score += 1;
      needs.papas += 1;
    }
    if (famMember.rendimentos < 100) score += 0.15;
    if (famMember.doencaBool) score += 0.25;
    if (famMember.outros) score += 0.1;
  });

  if (family.habiMauEstado) score += 0.1;


  needs.arroz = Math.floor(2.3 * score);
  needs.bolachas = Math.floor(1.2 * score);
  needs.atum = Math.floor(2.4 * score);
  needs.salsichas = Math.floor(1.2 * score);
  needs.leguminosas = Math.floor(1.25 * score);
  needs.leite = Math.round((5 * score) / 6) * 6;
  needs.massa = Math.floor(3.6 * score);
  needs.oleo = Math.floor(0.65 * score);
  needs.cereais = Math.floor(needs.cereais);
  needs.papas = Math.floor(needs.papas);


  return JSON.stringify(needs);
};

module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define(
    'Family',
    {
      nomeChefe: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      morada: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      telefone: DataTypes.INTEGER,
      rsiBool: DataTypes.BOOLEAN,
      rsiInt: DataTypes.INTEGER,
      habSocial: DataTypes.BOOLEAN,
      cabazMensal: DataTypes.BOOLEAN,
      escalao: DataTypes.BOOLEAN,
      outroSubsidio: DataTypes.BOOLEAN,
      despHabitacao: DataTypes.INTEGER,
      despMedicacao: DataTypes.INTEGER,
      despOutros: DataTypes.STRING,
      necessidadeEsp: DataTypes.STRING,
      habiMauEstado: DataTypes.BOOLEAN,
      disable: DataTypes.BOOLEAN,
      score: {
        type: DataTypes.FLOAT,
 
      },
      needs : {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  Family.associate = (models) => {
    /** generate new score each time family is saved */
    Family.addHook('beforeSave', async (family) => {
      family.score = await calculateScore(family, models);
      family.needs = await calculateNeeds(family, models);
    });

    /* Hook is called when the family model is updated */
    Family.addHook('beforeUpdate', async (instance, options) => {
      /* generate new score each time family is saved */
      instance.score = await calculateScore(instance, models);
      instance.needs = await calculateNeeds(instance, models);

      /* create a note if the note isnt null */
      if (instance.comment && instance.comment !== '') {
        await models.FamilyNotes.create({
          note: instance.comment,
          familyId: instance.id,
        });
      }

      /* create family record */
      return createEditFamilyRecord(instance, models);
    });

    // associations can be defined here
    // TODO: PERSON HASONE CHEFEFAMILIA,  VER ASSOCIACOES
    Family.hasMany(models.Person, { as: 'People' });
    Family.hasMany(models.EditFamilyRecord);
    Family.hasMany(models.FamilyNotes);
    Family.hasMany(models.Delivery);

  };

  return Family;
};
