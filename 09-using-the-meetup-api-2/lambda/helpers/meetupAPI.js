var request = require('request-promise');

module.exports = {

  GetUserDetails: (accessToken) => {
    return new Promise((resolve, reject) => {
      request({
        url: "https://api.meetup.com/2/member/self/?access_token="+ accessToken,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Return User Details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        // API Error
        reject('Meetup API Error: ', error);
      });
    });
  },

  GetMeetupGroupDetails: (accessToken, meetupURL) => {
    return new Promise((resolve, reject) => {
      request({
        qs: {
          access_token: accessToken,
          'photo-host': 'secure',
          fields: 'next_event,last_event,plain_text_description'
        },
        url: "https://api.meetup.com/"+ meetupURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Return Meetup Group Details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        // API Error
        reject('Meetup API Error: ', error);
      });
    });
  }

};
