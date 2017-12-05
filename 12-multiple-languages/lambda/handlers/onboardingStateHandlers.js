var Alexa = require('alexa-sdk');

// Opearlo Analytics
var OpearloAnalytics = require('opearlo-analytics');

// Constants
var constants = require('../constants/constants');

// Helpers
var meetupAPI = require('../helpers/meetupAPI');
var getResponse = require('../helpers/getResponse');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Change State to Main
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    }
    else {
      // Get Access Token
      var accessToken = this.event.session.user.accessToken;

      // Account Linked
      if (accessToken) {

        // Get User Details from Meetup API
        meetupAPI.GetUserDetails(accessToken)
          .then((userDetails) => {

            // Get Users Name
            var name = userDetails.name;

            // Store Users Name in Session
            this.attributes['userName'] = name;

            // Change State to MAIN
            this.handler.state = constants.states.MAIN;

            // Welcome User for the First Time
            this.emit(
              ':ask',
              getResponse(this.event.request.locale, 'ONBOARDING', [userName]),
              getResponse(this.event.request.locale, 'WHAT_WOULD_YOU_LIKE_TO_DO')
            );
          })
          .catch((error) => {
            console.log("MEETUP API ERROR: ", error);

            // Custom Voice Event
            OpearloAnalytics.registerVoiceEvent(this.event.session.user.userId, "Custom", "Meetup API Error");

            // Opearlo Analytics - Record Analytics
            OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
              this.emit(
                ':tell',
                getResponse(this.event.request.locale, 'MEETUP_ERROR')
              );
            });
          });
      }
      // Account Not Linked
      else {
        // Opearlo Analytics - Record Analytics
        OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
          this.emit(
            ':tellWithLinkAccountCard',
            getResponse(this.event.request.locale, 'LINK_ACCOUNT')
          );
        });
      }
    }
  },


  'AMAZON.StopIntent': function () {
    // Opearlo Analytics - Record Analytics
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(
        ':tell',
        getResponse(this.event.request.locale, 'GOODBYE')
      );
    });
  },

  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(
        ':tell',
        getResponse(this.event.request.locale, 'GOODBYE')
      );
    });
  },

  'SessionEndedRequest': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(':saveState', true);
    });
  },

  'AMAZON.HelpIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(
        ':tellWithLinkAccountCard',
        getResponse(this.event.request.locale, 'LINK_ACCOUNT')
      );
    });
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = onboardingStateHandlers;
