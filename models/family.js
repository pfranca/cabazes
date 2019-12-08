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
  let score = 0;

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
    if (famMember.faixaEtaria == "Adulto") {
      score += 2000;
    }
    if (famMember.faixaEtaria == "Criança") {
      score += 1500;
      needs.papas += 2;
      needs.cereais += 1;
    }
    if (famMember.faixaEtaria == "Idoso") {
      score += 1500;
      needs.papas += 1;
    }
    if (famMember.faixaEtaria == "Adolescente") {
      score += 2000;
      needs.cereais += 1;
    }
  });

  needs.arroz = Math.floor((10 * score * 0.2)/1280);
  needs.bolachas = Math.floor((10 * score * 0.1)/3555);
  needs.atum = Math.floor((10 * score * 0.025)/365.5);
  needs.salsichas = Math.floor((10 * score * 0.025)/392.5);
  needs.leguminosas = Math.floor((10 * score * 0.1)/1385.5);
  if (score <= 5000) {
     needs.leite = 6;
  }
  if (score > 5000 && score <= 9000) {
    needs.leite = 12;
  }
  if (score > 9000) {
    needs.leite = 18;
  }
  needs.massa = Math.floor((10 * score * 0.3)/3500);
  needs.oleo = Math.floor((10 * score * 0.05)/8307);
  needs.cereais = Math.floor(needs.cereais);
  needs.papas = Math.floor(needs.papas);
  needs.azeite = Math.floor((10 * score * 0.05)/8840);

  return score.toFixed(2);
};

const calculateNeeds = async (family, models) => {
  let score = 0;

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
    if (famMember.faixaEtaria == "Adulto") {
      score += 2000;
    }
    if (famMember.faixaEtaria == "Criança") {
      score += 1500;
      needs.papas += 2;
      needs.cereais += 1;
    }
    if (famMember.faixaEtaria == "Idoso") {
      score += 1500;
      needs.papas += 1;
    }
    if (famMember.faixaEtaria == "Adolescente") {
      score += 2000;
      needs.cereais += 1;
    }
  });

  needs.arroz = Math.floor((10 * score * 0.2)/1280);
  needs.bolachas = Math.floor((10 * score * 0.1)/3555);
  needs.atum = Math.floor((10 * score * 0.025)/365.5);
  needs.salsichas = Math.floor((10 * score * 0.025)/392.5);
  needs.leguminosas = Math.floor((10 * score * 0.1)/1385.5);
  if (score <= 5000) {
     needs.leite = 6;
  }
  if (score > 5000 && score <= 9000) {
    needs.leite = 12;
  }
  if (score > 9000) {
    needs.leite = 18;
  }
  needs.massa = Math.floor((10 * score * 0.3)/3500);
  needs.oleo = Math.floor((10 * score * 0.05)/8307);
  needs.cereais = Math.floor(needs.cereais);
  needs.papas = Math.floor(needs.papas);
  needs.azeite = Math.floor((10 * score * 0.05)/8840);

  return JSON.stringify(needs);
};

module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define('Family', {
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
      despOutros: DataTypes.INTEGER,
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
