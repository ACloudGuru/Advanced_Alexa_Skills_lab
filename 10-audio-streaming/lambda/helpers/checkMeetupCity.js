var alexaMeetups = require('../data/alexaMeetups');

module.exports = function checkMeetupCity(USCitySlot, EuropeanCitySlot) {

  // Get city
  var city;
  if (USCitySlot) {
    city = USCitySlot;
  }
  else if (EuropeanCitySlot) {
    city = EuropeanCitySlot;
  }

  // Check For City
  var cityMatch = false;
  for (var i = 0; i < alexaMeetups.length; i++) {
    if (alexaMeetups[i].city.toLowerCase() === city.toLowerCase()) {
      cityMatch = alexaMeetups[i];
    }
  }

  return cityMatch;
};
