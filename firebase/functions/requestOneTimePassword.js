const admin = require("firebase-admin");
const twilio = require("./twilio");

module.exports = function(request, response) {
  let {body: {phone}} = request;

  if (!phone) {
    return response.status(422).send({error: "'phone' parameter is missing"});
  }

  phone = String(phone).replace(/[^+\d]/g, "");

  admin.auth().getUser(phone)
      .then((userRecord) => {
        const code = Math.floor((Math.random() * 8999 + 1000));
        twilio.messages.create({
          body: `Your code is ${code}`,
          to: phone,
          from: "+19458003351",
        }, (error) => {
          if (error) {
            return response.status(422).send({error});
          }

          admin.database().ref(`users/${phone}`)
              .update({code, codeValid: true}, () => {
                response.send({success: true});
              });

          return response.send({success: true});
        });
      })
      .catch((error) => {
        response.status(422).send({error});
      });
};
