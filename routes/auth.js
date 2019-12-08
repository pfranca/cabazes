const express = require('express');
const models = require('../models');
const Auth = require('./role_verification');

const router = express.Router();
/* Create User */
router.get('/create-user', Auth.sessionChecker('admin'), (req, res) => {
  res.render('addUser');
});
router.post('/create-user', Auth.sessionChecker('admin'), (req, res) => {
  models.User.create({
    username: req.body.username,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('back');
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  models.User.findOne({ where: { username } }).then((user) => {
    if (!user) {
      res.redirect('back');
    } else if (!user.validPassword(password)) {
      res.redirect('back');
    } else {
      req.session.user = user.dataValues;
      res.redirect('/');
    }
  });
});

router.get('/change-password', (req, res) => {
  res.render('changePassword');
});
router.post('/change-password', (req, res) => {
  const new_password = req.body.new_password;
  const new_password2 = req.body.new_password2;
  const password = req.body.password;
  const username = req.body.username;

  models.User.findOne({ where: { username } }).then((user) => {
    if (!user) {
      res.redirect('/');
    } else if (user.validPassword(password) && (new_password2 === new_password)) {
      user.update({ password: new_password });
      res.redirect('/');
    } else {
      res.redirect('back');
    }
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('user_sid');
  res.redirect('/auth/login');
});


module.exports = router;
