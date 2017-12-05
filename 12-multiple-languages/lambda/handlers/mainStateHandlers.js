var Alexa = require('alexa-sdk');

// Opearlo Analytics
var OpearloAnalytics = require('opearlo-analytics');

// Constants
var constants = require('../constants/constants');

// Data
var alexaMeetups = require('../data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var meetupAPI = require('../helpers/meetupAPI');
var checkMeetupCity = require('../helpers/checkMeetupCity');
var getResponse = require('../helpers/getResponse');

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Welcome User Back by Name
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'WELCOME_BACK', [userName]),
        getResponse(this.event.request.locale, 'WHAT_WOULD_YOU_LIKE_TO_DO')
      );
    }
    else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
    }
  },


  // Main Audio Player Intent - Start a Podcast
  'PlayPodcast': function () {
    // Change the State to Audio Player
    this.handler.state = constants.states.AUDIO_PLAYER;
    this.emitWithState('PlayPodcast');
  },


  'AlexaMeetupNumbers': function () {
    var meetupNumbers = alexaMeetups.length;
    this.emit(
      ':ask',
      getResponse(this.event.request.locale, 'ALEXA_MEETUP_NUMBERS', [meetupNumbers]),
      getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
    );
  },


  'AlexaMeetupCityCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check City Match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to User
    if (cityMatch) {
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'CITY_CHECK_POSITIVE', [cityMatch.city]),
        getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
      );
    }
    else {
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'CITY_CHECK_NEGATIVE', [(USCitySlot || EuropeanCity)]),
        getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
      );
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
            var cardContent = getResponse(this.event.request.locale, 'CITY_CHECK_POSITIVE', [(cityMatch.city), organiserName]);

            var imageObj = {
                smallImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
                largeImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
            };

            // Respond to User
            this.emit(
              ':askWithCard',
              getResponse(this.event.request.locale, 'CITY_CHECK_POSITIVE', [(cityMatch.city), organiserName]),
              getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU'),
              cardTitle,
              cardContent,
              imageObj
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
    else {
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'CITY_CHECK_NEGATIVE', [(USCitySlot || EuropeanCity)]),
        getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
      );
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
            this.emit(
              ':ask',
              getResponse(this.event.request.locale, 'MEETUP_MEMBERS', [(cityMatch.city), meetupMembers]),
              getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
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
    else {
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'CITY_CHECK_NEGATIVE', [(USCitySlot || EuropeanCity)]),
        getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
      );
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
              this.emit(
                ':ask',
                getResponse(this.event.request.locale, 'NEXT_MEETUP_POSITIVE', [cityMatch.city, nextEventDate, nextEventDate, nextEvent.yes_rsvp_count]),
                getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
              );
            }
            else {
              this.emit(
                ':ask',
                getResponse(this.event.request.locale, 'NEXT_MEETUP_NEGATIVE', [cityMatch.city, meetupDetails.organizer.name]),
                getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
              );
            }

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
    else {
      this.emit(
        ':ask',
        getResponse(this.event.request.locale, 'CITY_CHECK_NEGATIVE', [(USCitySlot || EuropeanCity)]),
        getResponse(this.event.request.locale, 'HOW_CAN_I_HELP_YOU')
      );
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
    // Opearlo Analytics - Record Analytics
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(
        ':tell',
        getResponse(this.event.request.locale, 'GOODBYE')
      );
    });
  },

  'SessionEndedRequest': function () {
    // Opearlo Analytics - Record Analytics
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, process.env.OPEARLO_API_KEY, (result)=> {
      this.emit(':saveState', true);
    });
  },

  'AMAZON.HelpIntent': function () {
    this.emit(
      ':tell',
      getResponse(this.event.request.locale, 'MAIN_HELP'),
      getResponse(this.event.request.locale, 'WHAT_WOULD_YOU_LIKE_TO_DO')
    );
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = mainStateHandlers;
