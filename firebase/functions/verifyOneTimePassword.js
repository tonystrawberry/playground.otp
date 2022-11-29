const admin = require("firebase-admin");

module.exports = function(request, response) {
  let {body: {phone, code}} = request;

  if (!phone || !code) {
    return response.status(422)
        .send({error: "'phone' or 'code' parameter is missing"});
  }

  phone = String(phone).replace(/[^+\d]/g, "");
  code = parseInt(code);

  admin.auth().getUser(phone).then(() => {
    const ref = admin.database().ref(`users/${phone}`);
    ref.on("value", (snapshot) => {
      ref.off();
      const user = snapshot.val();

      if (user.code !== code || !user.codeValid) {
        return response.status(422).send({error: "Code is not valid"});
      }

      ref.update({codeValid: false});
      admin.auth().createCustomToken(phone)
          .then((token) => response.send({token: token}));
    });
  }).catch((error) => {
    response.status(422).send({error});
  });
};
