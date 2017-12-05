var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Change State to Onboarding:
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
      // Welcome User for the First Time
      this.emit(':ask', 'Welcome to Voice Devs! The skill that gives you all the information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast. But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.');
    }
  },

  'NameCapture': function () {
    // Get Slot Values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    // Get Name
    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }

    // Save Name in Session Attributes and Ask for Country
    if (name) {
      this.attributes['userName'] = name;
      this.emit(':ask', `Ok ${name}! Tell me what country you're from by saying: I'm from, and then the country you're from.`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise that name!`, `'Tell me your name by saying: My name is, and then your name.'`);
    }
  },

  'CountryCapture': function () {
    // Get Slot Values
    var country = this.event.request.intent.slots.Country.value;

    // Get User Name from Session Attributes
    var userName = this.attributes['userName'];

    // Save Name in Session Attributes and Ask for Country
    if (country) {
      this.attributes['userCountry'] = country;

      // Change State to Main
      this.handler.state = constants.states.MAIN;

      this.emit(':ask', `Ok ${userName}! Your from ${country}, that's great! You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast.  What would you like to do?`, `What would you like to do?`);
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise that country!`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
    }
  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    // User Name Attribute
    var userName = this.attributes['userName'];

    if (userName) {
      this.emit(':ask', `Please tell me what country you're from by saying: I'm from, and then the country you're from.`, `Tell me what country you're from by saying: I'm from, and then the country you're from.`);
    } else {
      this.emit(':ask', 'Please tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.');
    }
  },

  'Unhandled' : function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = onboardingStateHandlers;
