const register = function (Handlebars) {
  const helpers = {
    // put all of your helpers inside this object
    ifEquals(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    },
    bar() {
      return 'BAR';
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    for (const prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
