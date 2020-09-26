module.exports = {
  not: function (options) {
    return !options;
  },
  json: function (context) {
    return JSON.stringify(context);
  },
};
