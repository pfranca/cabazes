const express = require('express');
const validator = require('validator');
const models = require('../models');
const Auth = require('./role_verification');

const router = express.Router();

/* GET users listing. */
router.get('/', Auth.sessionChecker('viewer'),function(req, res) {
  res.send('respond with a resource');
});

router.get('/add/:id',Auth.sessionChecker('user'), (req, res, next) => {
  const id = req.params.id;
  res.render('createPerson', { familyid: id });
});
router.post('/add/:id', Auth.sessionChecker('user'),(req, res, next) => {
  const familyid = req.params.id;
  const name = req.body.name;
  const dateBirth = req.body.dateBirth;
  const ageGroup = req.body.ageGroup;
  const schoolDegree = req.body.school;
  const income = req.body.income;
  const diseasesBool = req.body.doencasBool;
  const doencasString = req.body.doencaString;
  const deficiente = req.body.deficiente;
  const outros = req.body.outros;
  if (validator.isLength(name, { min: 3, max: 60 })) {
    models.Person.create({
      name, dataNascimento: dateBirth, faixaEtaria: ageGroup, escolaridade: schoolDegree, doencaBool: diseasesBool, doencaString: doencasString, rendimentos: income, deficiente, outros, familyId: familyid,
    }, {}).then(() => {
      const flash = [];
      flash.push({
        type: 'success',
        message: 'Pessoa adicionada',
      }); // TODO mudar mensagem
      req.session.sessionFlash = flash;
      res.redirect('/families');
    }).catch((err) => {
      res.send(err).status(400);
    });
  } else {
    res.send('One or more fields could not be validated.').status(400);
  }
});

router.get('/edit/:id', Auth.sessionChecker('user'),(req, res, next) => {
  const id = req.params.id;
  models.Person.findAll({
    where: {
      id,
    },
  }).then((person) => {
    res.render('updatePerson', { person: person[0] });
  }).catch((err) => {
    res.send(`Database error - ${err}`).status(400);
  });
});

router.post('/edit/:id', Auth.sessionChecker('user'),function(req, res) {

  let id = req.params.id;
  let name = req.body.name;
  let dataNascimento = req.body.dataNascimento;
  let faixaEtaria = req.body.faixaEtaria;
  let escolaridade = req.body.escolaridade;
  let rendimentos = req.body.rendimentos;
  let doencasBool = Boolean(req.body.doencasBool);
  let doencasString = req.body.doencaString;
  let deficiente = Boolean(req.body.deficiente);
  let outros = Boolean(req.body.outros);
  if(validator.isLength(name,{min:3,max:60})){
    models.Person.findOne({
      where: {
        id,
      },
    }).then((person) => {
      person.update({
        name, dataNascimento, faixaEtaria, escolaridade, doencaBool: doencasBool, doencaString: doencasString, rendimentos, deficiente, outros,
      });
      const flash = [];
      flash.push({
        type: 'success',
        message: 'Pessoa atualizada',
      }); // TODO mudar mensagem
      req.session.sessionFlash = flash;
      res.redirect(`/families/${person.familyId}`);
    });
  } else {
    res.send('One or more fields could not be validated.').status(400);
  }
});

router.post('/deleteAction/:id',Auth.sessionChecker('user'), (req, res, next) => {
  console.log('DELETE');
  const id = req.params.id;
  models.Person.destroy({
    where: {
      id,
    },
  }).then((person) => {
    const flash = [];
    flash.push({
      type: 'success',
      message: 'Pessoa eliminada',
    }); // TODO mudar mensagem/ verificar redirect
    req.session.sessionFlash = flash;
  });
});

module.exports = router;
