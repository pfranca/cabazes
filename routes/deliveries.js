const express = require('express');
const validator = require('validator');
const Op = require('sequelize').Op;
const models = require('../models'); // para conseguir aceder a DB

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { orderBy, search } = req.query;

  const options = {
    include: [{ all: true }],
  };

      
  if (search != null) {
    options.where = {
      eventName: {
        [Op.like]: `%${search}%`,
      },
    };
  }

  // transfom the date into a more friendly output
  function dateTransformer(d) {
    const date = new Date(d);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }

    return `${dd}/${mm}/${yyyy}`;
  }

  try {
    let events = await models.Event.findAll(options);

    if (orderBy === 'name') {
      events = events.sort((a, b) => {
        if (a.eventName > b.eventName) return 1;
        if (a.eventName === b.eventName) return 0;
        return -1;
      });
    } else if (orderBy === 'data') {
      events = events.sort((a, b) => {
        if (a.finishedAt > b.finishedAt) return 1;
        if (a.finishedAt === b.finishedAt) return 0;
        return -1;
      });
    }

    const eventsList = events;
    const created = null;
    const finished = null;

    let ongoingEvent = null;

    eventsList.forEach((event) => {
      if (!event.hasEnded) ongoingEvent = event;
      else {
        event.created = dateTransformer(event.createdAt);
        event.finished = dateTransformer(event.finishedAt);
      }
    });

    res.render('deliveries', {
      events: eventsList,
      ongoing: ongoingEvent,
      search,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/addEvent', (req, res, next) => {
  const orderBy = req.query.orderBy;

  models.Family.findAll({ include: [{ all: true }] })
    .then((families) => {
      // order by request queries
      if (orderBy === 'name') {
        families = families.sort((a, b) => {
          if (a.nomeChefe > b.nomeChefe) return 1;
          if (a.nomeChefe === b.nomeChefe) return 0;
          return -1;
        });
      } else if (orderBy === 'score') {
        families = families.sort((a, b) => b.score - a.score);
      }

      res.render('addEvent', {
        title: 'Adicionar Evento',
        families,
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
    })
    .catch(e => next(e));
});

router.post('/addEvent', async (req, res, next) => {
  const { nomeEvento, idFam } = req.body;

  // validate body
  if (nomeEvento == null || idFam == null) res.next('Missing body parameters');

  try {
    const event = await models.Event.create({
      eventName: nomeEvento,
    });

    // check if idFam is just one or an array
    if (idFam instanceof Array) {
      idFam.forEach(async (id) => {
        await models.Delivery.create({
          done: false,
          eventId: event.id,
          familyId: id,
        });
      });
    } else {
      await models.Delivery.create({
        done: false,
        eventId: event.id,
        familyId: idFam,
      });
    }

    res.redirect('/deliveries');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
