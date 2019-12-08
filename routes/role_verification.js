// Verifica se user está autenticado


const sessionChecker = function (role) {
  return function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
      switch (role) {
        case 'admin': {
          if (req.session.user.role === 'admin') next();
          else res.redirect('/auth/login');
          break;
        }
        case 'user': {
          if (req.session.user.role === 'admin' || req.session.user.role === 'user') next();
          else res.redirect('/auth/login');
          break;
        }
        case 'viewer': {
          next();
          break;
        }
        default: {
          break;
        }
      }
    } else { // TODO adicionar mensagem de erro
      res.redirect('/auth/login');
    }
  };
};


module.exports.sessionChecker = sessionChecker;
