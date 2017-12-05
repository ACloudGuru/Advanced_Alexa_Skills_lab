var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaMeetups = require('../data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var meetupAPI = require('../helpers/meetupAPI');
var checkMeetupCity = require('../helpers/checkMeetupCity');
var getLondonAudio = require('../helpers/getLondonAudio');
var alexaDateUtil = require('../helpers/alexaDateUtil');

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Welcome User Back by Name
      this.emit(':ask', `Welcome back ${userName}! You can ask me about the various alexa meetups around the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
    }
    else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
    }
  },

  'AlexaMeetupNumbers': function () {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `I currently know of ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`, 'How can i help?');
  },

  'AlexaMeetupCityCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {
      this.emit(':ask', `${getLondonAudio(cityMatch.city)} Yes! ${cityMatch.city} has an Alexa developer meetup!`, 'How can i help?');
    }
    else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCity)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can i help?');
    }
  },

  'AlexaMeetupOrganiserCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Get Access Token from Alexa Request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {

        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {
            // Get Organiser Name
            var organiserName = meetupDetails.organizer.name;

            var cardTitle = `${organiserName}`;
            var cardContent = `The organiser of the ${cityMatch.city} Alexa developer meetup is ${organiserName}!`;

            var imageObj = {
                smallImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
                largeImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
            };

            // Respond to User
            this.emit(':askWithCard', `${getLondonAudio(cityMatch.city)} The organiser of the ${cityMatch.city} Alexa developer meetup is ${organiserName}.`, 'How can i help?', cardTitle, cardContent, imageObj);
          })
          .catch((error) => {
            console.log("MEETUP API ERROR: ", error);
            this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
          });
      }
      // Account Not Linked
      else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skil. I\'ve sent the details to your alexa app.');
      }
    }
    else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can i help?');
    }
  },


  'AlexaMeetupMembersCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Get Access Token from Alexa Request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {

        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {

            // Get Number of Meetup Members
            var meetupMembers = meetupDetails.members;

            // Respond to User
            this.emit(':ask', `${getLondonAudio(cityMatch.city)} The ${cityMatch.city} Alexa developer meetup currently has ${meetupMembers} members - Nice! How else can i help you?`, 'How can i help?');
          })
          .catch((error) => {
            console.log("MEETUP API ERROR: ", error);
            this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
          });
      }
      // Account Not Linked
      else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skil. I\'ve sent the details to your alexa app.');
      }
    }
    else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can i help?');
    }
  },

  'AlexaNextMeetupCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {

      // Get Access Token from Alexa Request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {

        // Get Meetup Group Details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
          .then((meetupDetails) => {

            // Get Next Event
            var nextEvent = meetupDetails.next_event;

            if (nextEvent) {
              var nextEventDate = new Date(nextEvent.time);

              // Respond to User
              this.emit(':ask', `${getLondonAudio(cityMatch.city)} The next ${cityMatch.city} Alexa developer meetup is on ${alexaDateUtil.getFormattedDate(nextEventDate)} at ${alexaDateUtil.getFormattedTime(nextEventDate)}! Currently ${nextEvent.yes_rsvp_count} members have RSVP'd. How else can i help you?`, 'How can i help?');
            }
            else {
              this.emit(':ask', `${getLondonAudio(cityMatch.city)} There's currently no upcoming meetups in ${cityMatch.city}. You should chase the organiser, ${meetupDetails.organizer.name} to schedule one!. How else can i help you?`, 'How else can i help?');
            }

          })
          .catch((error) => {
            console.log("MEETUP API ERROR: ", error);
            this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
          });
      }
      // Account Not Linked
      else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skil. I\'ve sent the details to your alexa app.');
      }
    }
    else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can i help?');
    }
  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function () {
    // Force State to Save when the user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', `You can ask me about the various alexa meetups around the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = mainStateHandlers;
