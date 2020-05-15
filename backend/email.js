const nodemailer = require('nodemailer');
const EMAIL = 'houseofrestaurants.prf@gmail.com',
  EMAIL_PWD = 'houseofrestaurants2020';
const  transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: EMAIL_PWD
  }
});

module.exports = {
  sendRegistrationEmail: function (to) {
    const mailOptions = {
      from: EMAIL,
      to: to,
      subject: 'Köszönjük a rendszerünkben!',
      text: 'Köszönjük a regisztrációd, kellemes böngészést kívánunk!'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent for registration: ' + info.response);
      }
    });
  },

  sendOrderConfirmEmail: function (order, to) {
    const deliveryTime = Math.floor(Math.random() * 80) + 40;
    const mailOptions = {
      from: EMAIL,
      to: to,
      subject: 'Köszönjük a megrendelést',
      html: '<h1>Köszönjük a megrendelést</h1><p>A megrendelését fogadtuk, várható kiszállítási idő: ' + deliveryTime + ' perc.</p><br><p>HouseOfRestaurants csapata</p>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent for registration: ' + info.response);
      }
    });
  }
}


