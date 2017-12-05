module.exports = function getLondonAudio(city) {

  var londonAudio = ``;
  if (city.toLowerCase() === 'london') {
    londonAudio = `<audio src="https://s3-eu-west-1.amazonaws.com/voice-devs/london-baby.mp3"/>`;
  }

  return londonAudio;
};
