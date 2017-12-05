var getLondonAudio = require('./getLondonAudio');
var alexaDateUtil_DE = require('../helpers/alexaDateUtil_DE');
var alexaDateUtil_EN = require('../helpers/alexaDateUtil_EN');

module.exports = function getResponse(locale, responseName, responseVariables) {

  var response;

  switch (responseName) {

    // ONBOARDING
    // Variable 1 - userName
    case 'ONBOARDING':
      // German
      if (locale === 'de-DE') {
        response = `Hallo ${userName}! Willkommen zu Voice Devs! Die Fähigkeit die Dir alle Informationen über die Alexa Entwickler community gibt. Du kannst mich über die verschiedenen Alexa meetups auf der ganzen Welt fragen, oder den Alexa Dev Chat Postcast hören.`;
      }
      // UK / US
      else {
        response = `Hi ${responseVariables[0]}! Welcome to Voice Devs! The skill that gives you all the information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast.`;
      }
      break;


    // WELCOME_BACK
    // Variable 1 - userName
    case 'WELCOME_BACK':
      // German
      if (locale === 'de-DE') {
        response = `Wilkommen zurück ${responseVariables[0]}! Du kannst mich über die verschiedenen Alexa meetups auf der ganzen Welt fragen, oder den Alexa Dev Chat Postcast hören.`;
      }
      // UK / US
      else {
        response = `Welcome back ${responseVariables[0]}! You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast.`;
      }
      break;


    // WHAT_WOULD_YOU_LIKE_TO_DO
    case 'WHAT_WOULD_YOU_LIKE_TO_DO':
      // German
      if (locale === 'de-DE') {
        response = `Was möchtest du tun?`;
      }
      // UK / US
      else {
        response = `What would you like to do?`;
      }
      break;


    // HOW_CAN_I_HELP_YOU
    case 'HOW_CAN_I_HELP_YOU':
      // German
      if (locale === 'de-DE') {
        response = `Wie kann ich dir sonst noch weiterhelfen?`;
      }
      // UK / US
      else {
        response = `How else can I help you?`;
      }
      break;


    // ALEXA_MEETUP_NUMBERS
    // Variable 1 - meetupNumbers
    case 'ALEXA_MEETUP_NUMBERS':
      // German
      if (locale === 'de-DE') {
        response = `Aktuell weiß ich von ${responseVariables[0]} Alexa Entwickler meetups. Schau nach, ob deine Stadt dabei ist!`;
      }
      // UK / US
      else {
        response = `I currently know of ${responseVariables[0]} Alexa developer meetups. Check to see if your city is one of them!`;
      }
      break;


    // CITY_CHECK_POSITIVE
    // Variable 1 - city
    case 'CITY_CHECK_POSITIVE':
      // German
      if (locale === 'de-DE') {
        response = `${getLondonAudio(responseVariables[0])} Ja! ${responseVariables[0]} hat ein Alexa Entwickler meetup! `;
      }
      // UK / US
      else {
        response = `${getLondonAudio(responseVariables[0])} Yes! ${responseVariables[0]} has an Alexa developer meetup!`;
      }
      break;


    // CITY_CHECK_NEGATIVE
    // Variable 1 - city
    case 'CITY_CHECK_NEGATIVE':
      // German
      if (locale === 'de-DE') {
        response = `${getLondonAudio(responseVariables[0])} Es tut mir leid, es sieht so aus, als hätte ${responseVariables[0]} gerade kein Alexa Entwickler meetup - warum startest du nicht eins!`;
      }
      // UK / US
      else {
        response = `${getLondonAudio(responseVariables[0])} Sorry, looks like ${responseVariables[0]} doesn't have an Alexa developer meetup yet - why don't you start one!`;
      }
      break;


    // ORGANISER_NAME
    // Variable 1 - city
    // Variable 2 - organiserName
    case 'ORGANISER_NAME':
      // German
      if (locale === 'de-DE') {
        response = `${getLondonAudio(responseVariables[0])} Der Veranstalter des ${responseVariables[0]} Alexa Entwickler meetups ist is ${responseVariables[1]}. `;
      }
      // UK / US
      else {
        response = `${getLondonAudio(responseVariables[0])} The organiser of the ${responseVariables[0]} Alexa developer meetup is ${responseVariables[1]}.`;
      }
      break;


    // MEETUP_ERROR
    case 'MEETUP_ERROR':
      // German
      if (locale === 'de-DE') {
        response = `Es tut mir leid, es gibt ein Problem beim Zugriff auf Deine meetup Kontodaten.`;
      }
      // UK / US
      else {
        response = `Sorry, there was a problem accessing your meetup account details.`;
      }
      break;


    // LINK_ACCOUNT
    case 'LINK_ACCOUNT':
      // German
      if (locale === 'de-DE') {
        response = `Bitte verbinde dein Konto um diese  Fähigkeit zu nutzen. Ich habe die Details an deine Alexa App gesendet.`;
      }
      // UK / US
      else {
        response = `Please link your account to use this skill. I've sent the details to your Alexa app.`;
      }
      break;


    // MEETUP_MEMBERS
    // Variable 1 - city
    // Variable 2 - meetupMembers
    case 'MEETUP_MEMBERS':
      // German
      if (locale === 'de-DE') {
        response = `Das ${responseVariables[0]} Alexa Entwickler meetup hat zurzeit ${responseVariables[1]} Mitglieder - Nice!`;
      }
      // UK / US
      else {
        response = `The ${responseVariables[0]} Alexa developer meetup currently has ${responseVariables[1]} members - Nice!`;
      }
      break;


    // NEXT_MEETUP_POSITIVE
    // Variable 1 - city
    // Variable 2 - date
    // Variable 3 - time
    // Variable 4 - rsvp_count
    case 'NEXT_MEETUP_POSITIVE':
      // German
      if (locale === 'de-DE') {
        response = `Das nächste ${responseVariables[0]} Alexa Entwickler meetup ist am ${alexaDateUtil_DE.getFormattedDate(responseVariables[1])} um ${alexaDateUtil_DE.getFormattedTime(responseVariables[2])}. Zur Zeit haben ${responseVariables[3]} Mitglieder RSVP'd.`;
      }
      // UK / US
      else {
        response = `The next ${responseVariables[0]} Alexa developer meetup is on ${alexaDateUtil_EN.getFormattedDate(responseVariables[1])} at ${alexaDateUtil_EN.getFormattedTime(responseVariables[2])}. Currently ${responseVariables[3]} members have RSVP'd.`;
      }
      break;


    // NEXT_MEETUP_NEGATIVE
    // Variable 1 - city
    // Variable 2 - organiserName
    case 'NEXT_MEETUP_NEGATIVE':
      // German
      if (locale === 'de-DE') {
        response = `Es gibt zurzeit ist kein bevorstehendes meetup in ${responseVariables[0]}. Du solltest ${responseVariables[1]} kontaktieren, ein meetup zu organisieren!`;
      }
      // UK / US
      else {
        response = `There's currently no upcoming meetups in ${responseVariables[0]}. You should chase the organiser, ${responseVariables[1]} to schedule one!`;
      }
      break;


    // MAIN_HELP
    case 'MAIN_HELP':
      // German
      if (locale === 'de-DE') {
        response = `Du kannst mich über die weltweiten verschiedenen alexa meetups auf der ganzen Welt fragen, oder den Alexa Dev Chat Postcast hören.`;
      }
      // UK / US
      else {
        response = `You can ask me about the various alexa meetups around the world, or listen to the alexa dev chat podcast.`;
      }
      break;


    // PODCAST_PLAY_EPISODE
    // Variable 1 - episodeNumber
    case 'PODCAST_PLAY_EPISODE':
      // German
      if (locale === 'de-DE') {
        response = `Spiele die Episode ${responseVariables[0]} des Alexa Dev Chat Podcasts ab.`;
      }
      // UK / US
      else {
        response = `Playing episode ${responseVariables[0]} of the Alexa Dev Chat podcast.`;
      }
      break;


    // PODCAST_PLAY_LATEST_EPISODE
    // Variable 1 - episodeNumber
    case 'PODCAST_PLAY_LATEST_EPISODE':
      // German
      if (locale === 'de-DE') {
        response = `Spiele die aktuellste Episode: ${responseVariables[0]} des Alexa Dev Chat Podcasts ab.`;
      }
      // UK / US
      else {
        response = `Playing latest episode: ${responseVariables[0]}, of the Alexa Dev Chat podcast.`;
      }
      break;


    // PODCAST_INVALID_EPISODE
    // Variable 1 - numberOfPodcasts
    case 'PODCAST_INVALID_EPISODE':
      // German
      if (locale === 'de-DE') {
        response = `Es tut mir leid, zur Zeit sind nur ${responseVariables[0]} Alexa Dev Chat Podcasts zur Verfügung. Tweet Dave Isbitski @ the dave dev um die nächste Aufnahme zu bekommen!`;
      }
      // UK / US
      else {
        response = `Sorry, there are currently only ${responseVariables[0]} Alexa Dev Chat podcast episodes. tweet Dave Isbitski @ the dave dev to get the next one recorded!`;
      }
      break;


    // PODCAST_HELP
    case 'PODCAST_HELP':
      // German
      if (locale === 'de-DE') {
        response = `Du hörst den Alexa Dev Chat Podcast. Um durch den Podcast zu navigieren, sage Next oder Previous. Du kannst den Podcast jederzeit pausieren, sage einfach Pause. Um weiter zu hören sage resume.`;
      }
      // UK / US
      else {
        response = `You are listening to the Alexa Dev Chat Podcast. You can say, Next or Previous to navigate through the podcasts. At any time, you can say Pause to pause the audio and Resume to resume.`;
      }
      break;


    // FIRST_EPISODE
    case 'FIRST_EPISODE':
      // German
      if (locale === 'de-DE') {
        response = `Dies ist die erste Episode!`;
      }
      // UK / US
      else {
        response = `This is the first episode!`;
      }
      break;


    // LAST_EPISODE
    // Variable 1 - episodeNumber
    case 'LAST_EPISODE':
      // German
      if (locale === 'de-DE') {
        response = `Es tut mir leid, Episode ${responseVariables[0]} ist die aktuellste Episode. Setzte fort.`;
      }
      // UK / US
      else {
        response = `Sorry, episode ${responseVariables[0]} is the latest episode. Resuming.`;
      }
      break;


    // GOODBYE
    case 'GOODBYE':
      // German
      if (locale === 'de-DE') {
        response = `Aus Wiedersehen!`;
      }
      // UK / US
      else {
        response = `Goodbye!`;
      }
      break;

  }

  // Return Appropriate Response
  return response;

};
