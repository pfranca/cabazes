const express = require('express');
const Sequelize = require('sequelize');
const models = require('../models');
const Auth = require('./role_verification');

// para conseguir aceder a DB
const router = express.Router();


router.get('/', (req, res, next) => {
  const orderBy = req.query.orderBy;
  const food = models.Food.findAll({ include: [{ all: true }] });
  const families = models.Family.findAll({ include: [{ all: true }] });
  const events = models.Event.findAll({ include: [{ all: true }] });

  Promise.all([food, families, events]).then((response) => {
    let foodList = response[0];
    const eventsList = response[2];

    let ongoingEvent = null;

    eventsList.forEach((event) => {
      if (event.hasEnded == 0){
        ongoingEvent = event;
      }
    });

    let numeroTotalStock = 0;
    response[0].forEach((foods) => {
      numeroTotalStock += foods.quantity;
    });

    console.log("ONGOING");
    console.log(ongoingEvent);

    if(ongoingEvent != null){
    let familiesInEvent = [];
    response[1].forEach( family => {
      ongoingEvent.Deliveries.forEach( delivery => {
        if(family.id === delivery.familyId){
          familiesInEvent.push(family);
        }
      })
    })

    const needs = {
      açucar: 0,
      aletria: 0,
      arroz: 0,
      azeite: 0,
      bolachas: 0,
      atum: 0,
      salsichas: 0,
      leguminosas: 0,
      leite: 0,
      massa: 0,
      cereais: 0,
      papas: 0,
      oleo: 0,
    };

    familiesInEvent.forEach((family) => {
      let score = 1;

      needs.açucar += 1;
      needs.aletria += 1;
      needs.azeite += 1;

      family.People.forEach((famMember) => {
        if (famMember.idade >= 18 && famMember.idade < 65 && !famMember.doencaBool && !famMember.deficiente) score += 0.5;
        if (famMember.idade >= 18 && famMember.idade < 65 && famMember.deficiente) { score += 0.75; needs.papas += 1; }
        if (famMember.idade >= 65) { score += 0.55; needs.papas += 1; }
        if (famMember.idade > 12 && famMember.idade < 18) { score += 0.5; needs.cereais += 1; }
        if (famMember.idade <= 12) { score += 0.75; needs.cereais += 1; needs.papas += 1; }
        if (famMember.idade < 18 && famMember.deficiente) { score += 1; needs.papas += 1; }
        if (famMember.rendimentos < 100) score += 0.15;
        if (famMember.doencaBool) score += 0.25;
        if (famMember.outros) score += 0.1;
      });
      if (family.habiMauEstado) score += 0.1;

      family.score = score.toFixed(2);

      needs.arroz += Math.floor(2.3 * score);
      needs.bolachas += Math.floor(1.2 * score);
      needs.atum += Math.floor(2.4 * score);
      needs.salsichas += Math.floor(1.2 * score);
      needs.leguminosas += Math.floor(1.25 * score);
      needs.leite += Math.round((5 * score) / 6) * 6;
      needs.massa += Math.floor(3.6 * score);
      needs.oleo += Math.floor(0.65 * score);
      needs.cereais = Math.floor(needs.cereais);
      needs.papas = Math.floor(needs.papas);
    });
   
    const numeroTotalNecessario = Object.keys(needs).reduce((sum, key) => sum + parseFloat(needs[key]), 0);

    const percentagem = (numeroTotalStock / numeroTotalNecessario) * 100;

    const needValues = [];
    for (variable in needs) {
      needValues.push(needs[variable]);
    }
    for (let x = 0; x < foodList.length; x++) {
      const element = foodList[x];
      element.needs = needValues[x];
      //console.log(`${needValues[x]} ${element}`);
      element.percent = (parseInt(element.quantity) / element.needs) * 100;
    }
  
    res.render('food', {
      food: foodList,
      ongoing: ongoingEvent,
      needs,
      numeroTotalNecessario,
      numeroTotalStock,
      percentagem,
    });
  }else{
  res.render('food', {
    food: foodList
  });
}
  }).catch((err) => {
    res.send('Database error.').status(400);
  });
});


router.post('/:id/add', Auth.sessionChecker('user'), (req, res, next) => {
  const id = req.params.id;
  const quantity = req.body.quantityToUpdate;
  models.Food.findById(id).then((foodType) => {
    const currentQuantity = foodType.quantity;
    foodType.quantity = currentQuantity + Number(quantity);
    foodType.save().then(() => {
      const flash = [];
      flash.push({
        type: 'success',
        message: 'Quantidade atualizada',
      }); // TODO mudar mensagem
      req.session.sessionFlash = flash;
      res.redirect('/food');
    }).catch((err) => {
      res.send('Database error.').status(400);
    });
  }).catch((err) => {
    res.send('Database error.').status(400);
  });
});

router.post('/:id/sub',Auth.sessionChecker('user'), (req, res, next) => {
  const id = req.params.id;
  const quantity = req.body.quantityToUpdate;
  const value = req.body.value;
  models.Food.findById(id).then((foodType) => {
    const currentQuantity = foodType.quantity;
    foodType.quantity = currentQuantity - Number(quantity);
    foodType.save().then(() => {
      const flash = [];
      flash.push({
        type: 'success',
        message: 'Quantidade atualizada',
      }); // TODO mudar mensagem
      req.session.sessionFlash = flash;
      res.redirect('/food');
    });
  }).catch((err) => {
    res.send('Database error.').status(400);
  }).catch((err) => {
    res.send('Database error.').status(400);
  });
});


module.exports = router;
