const register = function (Handlebars) {
  const helpers = {
    // put all of your helpers inside this object
    ifEquals(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    },
    if_eq(a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    bar() {
      return 'BAR';
    },
    sum(arg1, arg2){
      return (arg1+arg2);
    }
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
