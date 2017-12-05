var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Helpers
var meetupAPI = require('../helpers/meetupAPI');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Change State to Main:
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
      // Get Access Token from Alexa Request
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {

        // Get User Details from Meetup API
        meetupAPI.GetUserDetails(accessToken)
          .then((userDetails) => {
            console.log('userDetails', JSON.stringify(userDetails));
            // Get Users Name
            var name = userDetails.name;

            // Store Users Name in Session
            this.attributes['userName'] = name;

            // Change State to Main:
            this.handler.state = constants.states.MAIN;

            // Welcome User for the First Time
            this.emit(':ask', `Hi ${name}! Welcome to Voice Devs! The skill that gives you all the information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast. What would you like to do?`, 'What would you like to do?');
          })
          .catch((error) => {
            console.log('Meetup API ERROR', error);
            this.emit(':tell' `Sorry, there was a problem accessing your meetup account details.`);
          });
      } else {
        // Account Not Linked
        this.emit(':tellWithLinkAccountCard', `Please link your account to use this skill. I've sent the details to your alexa app.`);
      }
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
    // Account Not Linked
    this.emit(':tellWithLinkAccountCard', `Please link your account to use this skill. I've sent the details to your alexa app.`);
  },
  'Unhandled' : function () {
    // Account Not Linked
    this.emit(':tellWithLinkAccountCard', `Please link your account to use this skill. I've sent the details to your alexa app.`);
  }

});

module.exports = onboardingStateHandlers;
