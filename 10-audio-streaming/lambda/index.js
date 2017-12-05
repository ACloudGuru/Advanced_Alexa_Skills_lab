var Alexa = require('alexa-sdk');

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

  alexa.registerHandlers(
    onboardingStateHandlers,
    mainStateHandlers,
    audioPlayerHandlers
  );

  alexa.execute();
};
