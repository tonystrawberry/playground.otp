const admin = require("firebase-admin");

module.exports = function(request, response) {
  let {body: {phone}} = request;

  // Verify the user provided a phone number
  if (!phone) {
    return response.status(422).send({error: "'phone' parameter is missing"});
  }

  // Format the phone number to remove dashes and parentheses
  phone = String(phone).replace(/[^+\d]/g, "");

  // Create a new user account using that phone number
  admin.auth().createUser({uid: phone})
      .then((user) => response.send(user))
      .catch((error) => response.status(422).send({error}));

  // Respond to that use request
};
