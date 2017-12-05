var Alexa = require('alexa-sdk');

// Data
var alexaMeetups = require('./data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Voice Devs!', 'Try saying hello!');
  },

  'Hello': function () {
    this.emit(':tell', 'Hi there!');
  },

  'AlexaMeetupNumbers': function () {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `There are currently ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`, 'How can i help?');
  },

  'AlexaMeetupCityCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get City
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can i help?');
    }

    // Check for City
    var cityMatch = '';
    for (var i = 0; i < alexaMeetups.length; i++) {
      if ( alexaMeetups[i].city.toLowerCase() === city.toLowerCase() ) {
        cityMatch = alexaMeetups[i].city;
      }
    }

    // Respond to User
    if (cityMatch !== '') {
      this.emit(':ask', `Yes! ${city} has an Alexa developer meetup!`, 'How can i help?');
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one!`, 'How can i help?');
    }

  },

  'AlexaMeetupOrganiserCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get City
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can i help?');
    }

    // Check for City & Organiser
    var cityMatch = '';
    var cityOrganisers;
    for (var i = 0; i < alexaMeetups.length; i++) {
      if ( alexaMeetups[i].city.toLowerCase() === city.toLowerCase() ) {
        cityMatch = alexaMeetups[i].city;
        cityOrganisers = alexaMeetups[i].organisers;
      }
    }

    // Respond to User
    if (cityMatch !== '') {
      // 1 Organiser
      if (cityOrganisers.length === 1) {
        this.emit(':ask', `The organiser of the ${city} Alexa developer meetup is ${cityOrganisers[0]}.`, 'How can i help?');
      }  else { // Multiple Organisers
        this.emit(':ask', `The organisers of the ${city} Alexa developer meetup are: ${convertArrayToReadableString(cityOrganisers)}`, 'How can i help?');
      }

    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one!`, 'How can i help?');
    }

  }


};
