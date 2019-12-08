const express = require('express');
const validator = require('validator');
const Op = require('sequelize');
const models = require('../models');
const Auth = require('./role_verification');

const router = express.Router();
/* GET families page */
router.get('/', Auth.sessionChecker('viewer'), (req, res) => {
  const { orderBy, search } = req.query;

  const options = {
    include: [{ all: true }],
  };

  if (search != null) {
    options.where = {
      nomeChefe: {
        [Op.like]: `%${search}%`,
      },
    };
  }

  models.Family.findAll(options).then((families) => {
    // order by request queries
    if (orderBy === 'name') {
      families = families.sort((a, b) => {
        if (a.nomeChefe > b.nomeChefe) return 1;
        if (a.nomeChefe === b.nomeChefe) return 0;
        return -1;
      });
    } else if (orderBy === 'score') {
      families = families.sort((a, b) => {
        if (a.score < b.score) return 1;
        if (a.score === b.score) return 0;
        return -1;
      });
    }

    families.forEach((family) => {
      family.needs = JSON.parse(family.needs);
    });

    res.render('families', {
      title: 'Familias',
      sessionFlash: res.locals.sessionFlash,
      families,
      search,
      helpers: {
        math(lvalue, operator, rvalue) {
          lvalue = parseFloat(lvalue);
          rvalue = parseFloat(rvalue);
          return {
            '+': lvalue + rvalue,
            '-': lvalue - rvalue,
            '*': lvalue * rvalue,
            '/': lvalue / rvalue,
            '%': lvalue % rvalue,
          }[operator];
        },
      },
    });
  });
});

/* GET family individual page */
router.get('/:id', Auth.sessionChecker('viewer'), async (req, res, next) => {
  console.log('called');

  const { id } = req.params;

  if (id == null) return next();

  try {
    const family = await models.Family.findById(id, {
      include: [{ all: true }],
    });

    if (family == null) return next();

    res.render('family', {
      title: `Família ${family.nomeChefe}`,
      sessionFlash: res.locals.sessionFlash,
      family,
      helpers: {
        math(lvalue, operator, rvalue, options) {
          lvalue = parseFloat(lvalue);
          rvalue = parseFloat(rvalue);
          return {
            '+': lvalue + rvalue,
            '-': lvalue - rvalue,
            '*': lvalue * rvalue,
            '/': lvalue / rvalue,
            '%': lvalue % rvalue,
          }[operator];
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/delete/:id', Auth.sessionChecker('user'), (req, res, next) => {
  const id = req.params.id;
  models.Family.destroy({
    where: {
      id,
    },
  }).then(() => {
    const flash = [];
    flash.push({
      type: 'warning',
      message: 'Familia eliminada',
    }); // TODO mudar mensagem
    req.session.sessionFlash = flash;
    res.redirect('/families');
  });
});

router.get('/disable/:id', Auth.sessionChecker('user'), (req, res, next) => {
  const id = req.params.id;
  models.Family.findById(id)
    .then((family) => {
      family.disable = true;
      family.save().then(() => {
        const flash = [];
        flash.push({
          type: 'warning',
          message: 'Familia desativada',
        }); // TODO mudar mensagem
        req.session.sessionFlash = flash;
        res.redirect('/families');
      });
    })
    .catch((err) => {
      res.send('Database error.').status(400);
    });
});

router.get('/update-info/:id', Auth.sessionChecker('user'), async (req, res) => {
  const { id } = req.params;

  try {
    const family = await models.Family.findAll({
      where: {
        id,
      },
    });

    res.render('updateFamily', { family: family[0] });
  } catch (err) {
    next(err);
  }
});

router.post('/update-info/:id', Auth.sessionChecker('user'), (req, res) => {
  const familyId = req.params.id;

  const {
    habiMauEstado,
    escalao,
    mensalCab,
    outroSubsidio,
    disable,
    tlfNumber,
    address,
    valor_rsi,
    socialHab,
    espNeeds,
    habDesps,
    medDesps,
    otherDesps,
    comment,
    editComment,
    rsi,
  } = req.body;

  const newValues = {
    habiMauEstado:
      habiMauEstado == null ? false : validator.toBoolean(habiMauEstado),
    morada: address,
    telefone: validator.toInt(tlfNumber),
    rsiInt: valor_rsi === '' ? null : validator.toInt(valor_rsi),
    rsiBool: rsi == null ? false : validator.toBoolean(rsi),
    habSocial: socialHab == null ? false : validator.toBoolean(socialHab),
    cabazMensal: mensalCab == null ? false : validator.toBoolean(mensalCab),
    escalao: escalao == null ? false : validator.toBoolean(escalao),
    outroSubsidio:
      outroSubsidio == null ? false : validator.toBoolean(outroSubsidio),
    despHabitacao: validator.toInt(habDesps),
    despMedicacao: validator.toInt(medDesps),
    despOutros: validator.toInt(otherDesps),
    necessidadeEsp: espNeeds,
    disable: disable == null ? false : validator.toBoolean(disable),
    editComment,
    comment,
  };

  models.Family.findOne({
    where: {
      id: familyId,
    },
  })
    .then(family => family.update(newValues))
    .then(() => {
      const flash = [];
      flash.push({
        type: 'success',
        message: 'Familia editada',
      }); // TODO: mudar mensagem
      req.session.sessionFlash = flash;
      res.redirect('/families');
    })
    .catch((error) => {
      const flash = [];
      error.errors.forEach((fields) => {
        flash.push({
          field: correctFields(fields.path),
          message: fields.message,
          type: 'danger',
        });
      });
      req.session.sessionFlash = flash;
      res.redirect('back');
    });
});

/* POST families name update */
router.post('/addNote', (req, res, next) => {
  models.FamilyNotes.create({
    familyId: req.body.famID,
    note: req.body.note,
  })
    .then((note) => {
      let famName = 'ERRO DESCONHECIDO';
      models.Family.findOne({
        where: {
          id: req.body.famID,
        },
      }).then((family) => {
        famName = family.nomeChefe;

        const flash = [];
        flash.push({
          type: 'success',
          message: `Nota adicionada à família ${famName}.`,
        }); // TODO mudar mensagem

        req.session.sessionFlash = flash;
        res.redirect('back');
      });
    })
    .catch((err) => {
      const flash = [];
      flash.push({
        type: 'error',
        message: 'Ocorreu um erro a adicionar uma nota!',
      }); // TODO mudar mensagem

      req.session.sessionFlash = flash;
      res.redirect('back');
    });
});

router.get('/addFamily', Auth.sessionChecker('user'), (req, res) => {
  res.render('addFamily', { title: 'Adicionar Familia' });
});


//EFAZERR ISTO . NAO ADICIONA A NOTA
router.post('/addFamily/create', async (req, res, next) => {
  const {
    nomeResponsavel,
    morada,
    telefone,
    habiMauEstado,
    rsi,
    valor_rsi,
    habitacaoSocial,
    cabazMensal,
    escalao,
    outroSub,
    valor_hab,
    valor_med,
    valor_outros,
    necessEspeciais,
    famNotes,
  } = req.body;

  models.Family.create({
    nomeChefe: nomeResponsavel,
    morada,
    telefone,
    habiMauEstado,
    rsiBool: rsi,
    rsiInt: valor_rsi,
    habSocial: habitacaoSocial,
    cabazMensal,
    escalao,
    outroSubsidio: outroSub,
    despHabitacao: valor_hab,
    despMedicacao: valor_med,
    despOutros: valor_outros,
    necessidadeEsp: necessEspeciais,
    disable: false,
  }).then( family => {
    models.FamilyNotes.create({
      familyId: family.id,
      note: req.body.famNotes,
    }).then( familynotes => {
      models.Person.create({
        name: nomeResponsavel,
        dataNascimento: req.body.dataNascimentoResponsavel,
        faixaEtaria: req.body.faixaEtariaResponsavel,
        doencaBool: req.body.doencasBool,
        doencaString: req.body.doencaString,
        rendimentos: req.body.rendimentosResponsavel,
        deficiente: req.body.deficiente,
        outros: req.body.outros,
        familyId: family.id,
      }).then( person => { 
        res.redirect('/families');
      });
    });
  });
});


module.exports = router;
