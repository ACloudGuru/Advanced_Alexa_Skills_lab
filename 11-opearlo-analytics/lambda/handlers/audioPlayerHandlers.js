var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaDevChatPodcasts = require('../data/alexaDevChatPodcasts');

// Audio Player Handlers
var audioPlayerHandlers = Alexa.CreateStateHandler(constants.states.AUDIO_PLAYER, {

  'LaunchRequest': function () {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  // Main Audio Player Intent - Start a Podcast
  'PlayPodcast': function () {

    // Get Episode Slot
    var episodeSlot = parseInt(this.event.request.intent.slots.Episode.value);

    // Play Specific Episode
    if (episodeSlot > 0 && episodeSlot <= alexaDevChatPodcasts.length) {

      // Set Audio Player Session Attributes
      this.attributes['currentEpisode'] = episodeSlot;
      this.attributes['offsetInMilliseconds'] = 0;

      // Speech Output
      this.response.speak(`Playing episode ${episodeSlot} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[episodeSlot-1].audioURL, episodeSlot, null, 0);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Invalid Episode Number
    else if (episodeSlot) {
      this.handler.state = constants.states.MAIN;
      this.emit(':tell', `Sorry, there are currently only ${alexaDevChatPodcasts.length} Alexa Dev Chat podcast episodes. Tweet Dave Isbitski @ the dave dev to get the next one recorded.`);
    }
    // Play Latest Episode
    else {

      // Set Audio Player Session Attributes
      this.attributes['currentEpisode'] = alexaDevChatPodcasts.length;
      this.attributes['offsetInMilliseconds'] = 0;

      // Speech Output
      this.response.speak(`Playing latest episode: ${alexaDevChatPodcasts.length} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[alexaDevChatPodcasts.length-1].audioURL, alexaDevChatPodcasts.length, null, 0);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
  },


  // Audio Control Intents - Intent Request Handlers
  'AMAZON.PauseIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.ResumeIntent': function () {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, offsetInMilliseconds);

    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },


  'AMAZON.NextIntent': function () {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // Last Episode - Resume Playing
    if (currentEpisode === alexaDevChatPodcasts.length) {

      // Speech Output
      this.response.speak(`Sorry, episode ${currentEpisode} is the latest episode. Resuming`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Play Next Episode
    else {
      currentEpisode++;

      // Speech Output
      this.response.speak(`Playing episode ${currentEpisode} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, 0);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
  },

  'AMAZON.PreviousIntent': function () {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // First Episode - Resume Playing
    if (currentEpisode === 1) {
      // Speech Output
      this.response.speak(`This is the first episode!`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Play Previous Episode
    else {
      currentEpisode--;

      // Speech Output
      this.response.speak(`Playing episode ${currentEpisode} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, 0);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
  },

  'AMAZON.RepeatIntent': function () {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, 0);

    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.StartOverIntent': function () {
    this.emitWithState('AMAZON.RepeatIntent');
  },


  'AMAZON.HelpIntent': function () {
    var audioHelpMessage = "You are listening to the Alexa Dev Chat Podcast. You can say, next or previous to navigate through the podcasts. At any time, you can say pause to pause the audio and resume to resume.";
    this.emit(':ask', audioHelpMessage, audioHelpMessage);
  },


  // Audio Event Handlers - AudioPlayer Request Handlers
  'PlaybackStarted': function () {
    this.attributes['currentEpisode'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = this.event.request.offsetInMilliseconds;
    this.emit(':saveState', true);
  },
  'PlaybackFinished': function () {
    // Back to Main State
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
  },
  'PlaybackStopped': function () {
    this.attributes['currentEpisode'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = this.event.request.offsetInMilliseconds;
    this.emit(':saveState', true);
  },
  'PlaybackFailed': function () {
    console.log('Player Failed: ', this.event.request.error);
    this.context.succeed(true);
  },


  // Unhandled Function - Handles Optional Audio Intents Gracefully
  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  },

});

module.exports = audioPlayerHandlers;
