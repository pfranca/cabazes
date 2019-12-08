const express = require('express');
const models = require('../models'); // para conseguir aceder a DB
const Auth = require('./role_verification');

const router = express.Router();

/* GET home page. */
router.get('/', Auth.sessionChecker('viewer'), (req, res, next) => {

  const events = models.Event.findAll({ where:{hasEnded:false}, include: [{ all: true }] });
  const families = models.Family.findAll({ include: [{ all: true }] });
  //const deliveries = models.Delivery.findAll({ include: [{ all: true }] });

  function dateTransformer(d){
    let date = new Date(d);
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    if(dd<10){
      dd='0'+dd;
    }
    if(mm<10){
      mm='0'+mm;
    }

    return dd+'/'+mm+'/'+yyyy;
  }


  Promise
    .all([events,families])
    .then(response => {
      //const deliveriesList = response[2];
      const familiesList = response[1];
      const eventsList = response[0];

      let ongoingEvent = null;
      let created = null;


      eventsList.forEach((event) => {
        if (event.hasEnded == 0){
          ongoingEvent = event;
          event.created= dateTransformer(event.createdAt);

        }
      });

      //ongoingEvent.Deliveries.Families = [];
      if(ongoingEvent != null){
        ongoingEvent.Deliveries.forEach(delivery =>{
          familiesList.forEach(family => {
            if(delivery.familyId == family.id){
              delivery.familyId=family;
            }
          })
        })
      }





  res.render('dashboard', {
    title: 'Dashboard',
    ongoing: ongoingEvent,
  });
  });
});

router.post('/imprimirPdf', (req, res, next) => {
  console.log("IMPRIMIR PDF")
})

router.post('/delivered', (req, res, next) => {

  let ids = req.body.idFam;
  let eventId = req.body.eventId;

  //check if it passed a string or an array, if it's a string it converts to an array
  if (typeof ids === 'string' || ids instanceof String)
    ids=[ids];

  for(let id of ids) {
    console.log(id);
    models.Family.findById(id, {
      include: [{ all: true }],
    })
    .then((family) => {
      for(let delivery of family.Deliveries) {
        if(delivery.done == 0 && delivery.eventId == eventId){
          models.Delivery.findById(delivery.id).then( deliveryObj => {
            deliveryObj.update({
              done : 1,
              deliveredAt : Date.now(),
              familyName : family.nomeChefe,
              deliveredGoods : family.needs
            })
          })
        }
      }
    })
  }
  res.redirect('/');
})

router.post('/gps', (req, res, next) => {
  console.log("gps")
})

router.post('/terminarEvento', (req, res, next) => {
  console.log("terminarEvento")
  let eventId = req.body.eventId;

  models.Event.findById(eventId, {
    include: [{ all: true }],
  })
  .then((event) => {
    event.update({
      hasEnded: 1,
      finishedAt: Date.now()
    })
  })

  res.redirect('/deliveries');
  
})

module.exports = router;
