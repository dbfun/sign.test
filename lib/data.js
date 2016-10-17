var randFloat = function(min, max, digits){

  var val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(digits));

}

randDate = function(year) {
  return new Date(year, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
}

randDateStr = function(year) {
  return randDate(year).format("dd.mm.yyyy");
}

module.exports.randFloat = randFloat;
module.exports.randDate = randDate;
module.exports.randDateStr = randDateStr;