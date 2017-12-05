var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaDevChatPodcasts = require('../data/alexaDevChatPodcasts');

// Helpers
var getResponse = require('../helpers/getResponse');

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
      this.response.speak(getResponse(this.event.request.locale, 'PODCAST_PLAY_EPISODE', [episodeSlot]));

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[episodeSlot-1].audioURL, episodeSlot, null, 0);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Invalid Episode Number
    else if (episodeSlot) {
      this.handler.state = constants.states.MAIN;
      this.emit(
        ':tell',
        getResponse(this.event.request.locale, 'PODCAST_INVALID_EPISODE', [alexaDevChatPodcasts.length])
      );
    }
    // Play Latest Episode
    else {

      // Set Audio Player Session Attributes
      this.attributes['currentEpisode'] = alexaDevChatPodcasts.length;
      this.attributes['offsetInMilliseconds'] = 0;

      // Speech Output
      this.response.speak(getResponse(this.event.request.locale, 'PODCAST_PLAY_LATEST_EPISODE', [alexaDevChatPodcasts.length]));

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
      this.response.speak(getResponse(this.event.request.locale, 'LAST_EPISODE', [currentEpisode]));

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Play Next Episode
    else {
      currentEpisode++;

      // Speech Output
      this.response.speak(getResponse(this.event.request.locale, 'PODCAST_PLAY_EPISODE', [currentEpisode]));

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
      this.response.speak(getResponse(this.event.request.locale, 'FIRST_EPISODE'));

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode-1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Play Previous Episode
    else {
      currentEpisode--;

      // Speech Output
      this.response.speak(getResponse(this.event.request.locale, 'PODCAST_PLAY_EPISODE', [currentEpisode]));

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
    this.emit(
      ':ask',
      getResponse(this.event.request.locale, 'PODCAST_HELP'),
      getResponse(this.event.request.locale, 'PODCAST_HELP')
    );
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
    console.log('Audio Player Failed: ', this.event.request.error);
    this.context.succeed(true);
  },


  // Unhandled Function - Handles Optional Audio Intents Gracefully
  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  },

});

module.exports = audioPlayerHandlers;
