var request = require('request-promise');

module.exports = {

  GetUserDetails: (accessToken) => {
    return new Promise((resolve, reject) => {
      // Call Meetup API
      request({
        url: "https://api.meetup.com/2/member/self/?access_token="+accessToken,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Return Users Details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        // API ERROR
        reject('Meetup API Error: ', error);
      });
    });
  }

};
