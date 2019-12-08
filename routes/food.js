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

  people.forEach((famMember) => {

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

    familiesInEvent.forEach((family) => {
        let score = 0;
        if (famMember.idade >= 18 && famMember.idade < 65) {
          score += 2000;
        }
        if (famMember.idade <= 12) {
          score += 1500;
          needs.papas += 2;
          needs.cereais += 1;
        }
        if (famMember.idade >= 65) {
          score += 1500;
          needs.papas += 1;
        }
        if (famMember.idade > 12 && famMember.idade < 18) {
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
