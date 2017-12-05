var Alexa = require('alexa-sdk');

// Opearlo Analytics
var OpearloAnalytics = require('opearlo-analytics');

// Constants
var constants = require('./constants/constants');

// Handlers
var onboardingStateHandlers = require('./handlers/onboardingStateHandlers');
var mainStateHandlers = require('./handlers/mainStateHandlers');
var audioPlayerHandlers = require('./handlers/audioPlayerHandlers');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);

  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  // Opearlo Analytics - Initialise
  if(event.session.new) {
    OpearloAnalytics.initializeAnalytics(process.env.OPEARLO_USER_ID, 'voice-devs', event.session);
  }

  // Opearlo Analytics - Track Launch Request
  if(event.request.type === "LaunchRequest") {
    OpearloAnalytics.registerVoiceEvent(event.session.user.userId, "LaunchRequest");
  }

  // Opearlo Analytics - Track All Intents
  if(event.request.type === "IntentRequest") {
    OpearloAnalytics.registerVoiceEvent(event.session.user.userId, "IntentRequest", event.request.intent);
  }


  alexa.registerHandlers(
    onboardingStateHandlers,
    mainStateHandlers,
    audioPlayerHandlers
  );

  alexa.execute();
};
