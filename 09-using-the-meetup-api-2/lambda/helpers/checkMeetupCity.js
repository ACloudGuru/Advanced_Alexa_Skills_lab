var alexaMeetups = require('../data/alexaMeetups');

module.exports = function checkMeetupCity(citySlot1, citySlot2) {

  var city = '';
  if (citySlot1) {
    city = citySlot1;
  } else if (citySlot2) {
    city = citySlot2;
  }

  var cityMatch = false;
  for (var i = 0; i < alexaMeetups.length; i++) {
    if ( alexaMeetups[i].city.toLowerCase() === city.toLowerCase() ) {
      cityMatch = alexaMeetups[i];
    }
  }

  return cityMatch;
};
